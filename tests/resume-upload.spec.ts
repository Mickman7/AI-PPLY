import { test, expect } from '@playwright/test';

// Test resume content
const testResume = `
Mick Johnson
Software Engineer
mick@email.com | (555) 123-4567 | linkedin.com/in/mickjohnson

SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, Python, and cloud technologies. Passionate about building scalable web applications and AI-powered solutions.

TECHNICAL SKILLS
• Programming: JavaScript, TypeScript, Python, Java
• Frontend: React, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, FastAPI, Django
• Database: MongoDB, PostgreSQL, MySQL
• Cloud: AWS, Docker, Kubernetes, CI/CD
• Tools: Git, Jest, Playwright, OpenAI API

EXPERIENCE
Senior Full Stack Developer - TechCorp Inc. (2021-Present)
• Developed and maintained React/Node.js applications serving 100k+ users
• Implemented CI/CD pipelines reducing deployment time by 40%
• Led migration from monolithic to microservices architecture

Software Engineer - StartupCo (2019-2021)
• Built RESTful APIs using Python FastAPI and Node.js
• Created responsive UIs with React and Material-UI
• Integrated machine learning models into production applications

EDUCATION
Bachelor of Computer Science - University of Technology (2015-2019)
`;

// Test job description
const testJobDescription = `
Senior Full Stack Developer

We are looking for a talented Senior Full Stack Developer to join our growing team. The ideal candidate will have strong experience with modern web technologies and a passion for building innovative solutions.

Responsibilities:
- Develop and maintain web applications using React and Node.js
- Design and implement RESTful APIs and microservices
- Work with cloud technologies (AWS, Docker, Kubernetes)
- Collaborate with cross-functional teams to deliver high-quality software
- Implement CI/CD pipelines and automated testing
- Integrate third-party APIs and services

Requirements:
- 5+ years of professional software development experience
- Strong proficiency in JavaScript/TypeScript, React, and Node.js
- Experience with Python and FastAPI/Django
- Knowledge of database systems (PostgreSQL, MongoDB)
- Familiarity with cloud platforms (AWS preferred)
- Experience with Docker and containerization
- Understanding of CI/CD principles
- Excellent problem-solving and communication skills

Nice to Have:
- Experience with AI/ML integration
- Knowledge of Kubernetes
- Previous startup experience
- OpenAPI specification experience
`;

test('resume upload and analysis workflow', async ({ page }) => {
  // Navigate to the upload page
  await page.goto('http://localhost:3000');

  // Verify we're on the upload page
  await expect(page).toHaveTitle('AI-PPLY');
  await expect(page.getByText('Upload Your Resume')).toBeVisible();

  // Create a test resume file
  const testResumeFile = `
    data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDU+PnN0cmVhbQoKcQoKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgo+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoyIDAgb2JqCjw8L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQl0KL0ZvbnQgPDwKPj4KL1hPYmplY3QgPDwKPj4KPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgMDAwMDAgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDAxNSAwMDAwMCBuCjAwMDAwMDAwMjEgMDAwMDAgbgowMDAwMDAwMDI3IDAwMDAwIG4KMDAwMDAwMDAzMyAwMDAwMCBuCnRyYWlsZXIKPDwKL1Jvb3QgNSAwIFIKL1NpemUgNgo+PgpzdGFydHhyZWYKMzgKJSVFT0YK
  `.replace(/\s/g, ''); // Remove whitespace

  // Upload the test resume file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test_resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(testResumeFile.split(',')[1], 'base64')
  });

  // Verify file was selected (you might need to adjust this selector based on your UploadCard component)
  await expect(page.getByText('test_resume.pdf')).toBeVisible({ timeout: 5000 });

  // Fill in the job description
  const jobTextarea = page.locator('textarea');
  await jobTextarea.fill(testJobDescription);

  // Verify job description was entered
  await expect(jobTextarea).toHaveValue(testJobDescription);

  // Mock the API response to avoid hitting real backend during tests
  await page.route('**/api/upload-text', async route => {
    const json = {
      match_score: 85,
      overview: {
        matches: "Strong alignment in React, Node.js, Python, and cloud technologies. Excellent fit for full stack development role.",
        gaps: "Could benefit from more Kubernetes experience and deeper OpenAPI knowledge."
      }
    };
    await route.fulfill({ json });
  });

  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: /analyze resume/i });
  await analyzeButton.click();

  // Verify navigation to results page
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByText(/match score/i)).toBeVisible();
  await expect(page.getByText('85%')).toBeVisible();

  // Verify the analysis results are displayed
  await expect(page.getByText(/strong alignment/i)).toBeVisible();
  await expect(page.getByText(/kubernetes experience/i)).toBeVisible();
});

test('validation - missing file shows error', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Fill job description but don't select file
  const jobTextarea = page.locator('textarea');
  await jobTextarea.fill(testJobDescription);

  // Mock the alert to prevent actual browser alert
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Please select a file');
    await dialog.dismiss();
  });

  // Click analyze without file
  const analyzeButton = page.getByRole('button', { name: /analyze resume/i });
  await analyzeButton.click();

  // Verify we're still on the upload page (no navigation)
  await expect(page).toHaveURL('http://localhost:3000/');
});

test('validation - missing job description shows error', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Upload file but don't enter job description
  const testResumeFile = 'data:application/pdf;base64,test'; // minimal base64
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('test')
  });

  // Mock the alert
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Please select a file and enter job description');
    await dialog.dismiss();
  });

  // Click analyze without job description
  const analyzeButton = page.getByRole('button', { name: /analyze resume/i });
  await analyzeButton.click();

  // Verify we're still on the upload page
  await expect(page).toHaveURL('http://localhost:3000/');
});
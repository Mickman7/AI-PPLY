import { useDropzone } from "react-dropzone"

// Accept a callback to send the selected file to parent
const UploadCard = ({ setFile }: { setFile: (file: File) => void }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    onDrop: (files) => {
      setFile(files[0])
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-lg border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-gray-700">
        {isDragActive ? "Drop your file here..." : "Drag & drop your resume file here"}
      </p>
      <button type="button" className="text-blue-500 hover:underline mt-2">or browse to upload</button>
      {acceptedFiles.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Selected file:</p>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UploadCard

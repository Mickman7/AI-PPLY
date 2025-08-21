import React from 'react';

const AuthPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '50px', marginBottom: '10px' }} />
          <h2>Welcome Back!</h2>
        </div>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>OR</div>
        <button
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          <img src="/google-icon.png" alt="Google Icon" style={{ width: '20px', marginRight: '10px' }} />
          Sign in with Google
        </button>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>Don't have an account? Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
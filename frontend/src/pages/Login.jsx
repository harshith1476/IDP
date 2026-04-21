import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('faculty'); // 'admin', 'faculty', or 'student'
  const [toggled, setToggled] = useState(false);
  const [studentToggled, setStudentToggled] = useState(false);
  const navigate = useNavigate();
  const studentCircleRef = useRef(null);
  const animationInitialized = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (loginType === 'student') {
        response = await authService.login(null, password, registerNumber);
      } else {
        response = await authService.login(email, password);
      }
      const user = authService.getCurrentUser();
      
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'STUDENT') {
        navigate('/student');
      } else {
        navigate('/faculty');
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.message) {
        // Network/timeout errors
        if (err.message.includes('timeout') || err.message.includes('network') || err.message.includes('Cannot connect')) {
          const backendUrl = import.meta.env.DEV ? 'http://localhost:8080' : 'https://drims-rnv0.onrender.com';
          errorMessage = `Cannot connect to server. Please ensure the backend is running on ${backendUrl}`;
        } else if (err.message.includes('timeout of')) {
          errorMessage = 'Request timed out. The server is taking too long to respond.';
        } else {
          // Use the error message from API or use a generic one
          errorMessage = err.message;
        }
      }
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        if (loginType === 'student') {
          errorMessage = 'Invalid register number or password';
        } else {
          errorMessage = 'Invalid email or password';
        }
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fillSampleCredentials = () => {
    if (loginType === 'admin') {
      setEmail('admin@drims.edu');
      setPassword('admin123');
    } else if (loginType === 'student') {
      setRegisterNumber('211FA04298');
      setPassword('student123');
    } else {
      setEmail('renugadevi.r@drims.edu');
      setPassword('faculty123');
    }
  };

  const switchLoginType = (type) => {
    setLoginType(type);
    setToggled(type === 'admin');
    setStudentToggled(type === 'student');
    setError('');
    setEmail('');
    setRegisterNumber('');
    setPassword('');
  };


  // Initialize student login animation
  useEffect(() => {
    if (studentToggled && studentCircleRef.current && !animationInitialized.current) {
      const circleContainer = studentCircleRef.current;
      const numBars = 50;
      let activeBars = 0;

      for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'student-bar';
        bar.style.transform = `rotate(${(360 / numBars) * i}deg) translateY(-170px)`;
        circleContainer.appendChild(bar);
      }

      function animateBars() {
        const bars = document.querySelectorAll('.student-bar');
        setInterval(() => {
          bars[activeBars % numBars].classList.add('active');
          if (activeBars > 8) {
            bars[(activeBars - 8) % numBars].classList.remove('active');
          }
          activeBars++;
        }, 100);
      }

      animateBars();
      animationInitialized.current = true;
    }
  }, [studentToggled]);

  return (
    <div className="login-page">
      {/* DRIMS Header - Like VIMS Style */}
      <header className="login-header">
        <div className="header-top-bar"></div>
        <div className="header-container">
          <div className="header-left">
            <img 
              src="/pictures/image.png" 
              alt="DRIMS Logo" 
              className="header-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          <div className="header-center">
            <div className="drims-branding">
              <div className="drims-logo">DRIMS</div>
              <div className="drims-separator"></div>
              <div className="drims-full-name">
                <div className="drims-line">DEPARTMENT</div>
                <div className="drims-line">RESEARCH</div>
                <div className="drims-line">INFORMATION</div>
                <div className="drims-line">MANAGEMENT</div>
                <div className="drims-line">SYSTEM</div>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="cse-label">CSE</div>
          </div>
        </div>
        <div className="header-bottom-bar"></div>
      </header>

      <div 
        className={`auth-wrapper ${toggled ? 'toggled' : ''} ${studentToggled ? 'student-toggled' : ''}`}
        onClick={(e) => {
          // Click outside to go back to faculty login
          if (studentToggled && e.target.classList.contains('auth-wrapper')) {
            switchLoginType('faculty');
          }
        }}
      >
        {/* Animated Background Shapes */}
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* Faculty Login Panel */}
        <div className="credentials-panel faculty">
          <h2 className="slide-element">Faculty Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="field-wrapper slide-element error-message">
                <div className="error-text">{error}</div>
              </div>
            )}

            <div className="field-wrapper slide-element">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <label>Email Address</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login as Faculty'}
              </button>
            </div>

            <div className="field-wrapper slide-element">
              <button
                type="button"
                onClick={fillSampleCredentials}
                className="sample-credentials-btn"
              >
                Use Sample Credentials
              </button>
            </div>

            <div className="switch-link slide-element">
              <div className="switch-links-container">
                <div className="switch-link-item">
                  <p>Administrator? <br /> <a href="#" className="admin-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('admin'); }}>Admin Login</a></p>
                </div>
                <div className="switch-link-item">
                  <p>Student? <br /> <a href="#" className="student-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('student'); }}>Student Login</a></p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Welcome Section for Faculty */}
        <div className="welcome-section faculty">
          <h2 className="slide-element">WELCOME BACK!</h2>
          <p className="slide-element">Faculty Portal</p>
          <p className="slide-element">Research & Publication Management</p>
        </div>

        {/* Admin Login Panel */}
        <div className="credentials-panel admin">
          <h2 className="slide-element">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="field-wrapper slide-element error-message">
                <div className="error-text">{error}</div>
              </div>
            )}

            <div className="field-wrapper slide-element">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <label>Email Address</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login as Administrator'}
              </button>
            </div>

            <div className="field-wrapper slide-element">
              <button
                type="button"
                onClick={fillSampleCredentials}
                className="sample-credentials-btn"
              >
                Use Sample Credentials
              </button>
            </div>

            <div className="switch-link slide-element">
              <div className="switch-links-container">
                <div className="switch-link-item">
                  <p>Faculty Member? <br /> <a href="#" className="faculty-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('faculty'); }}>Faculty Login</a></p>
                </div>
                <div className="switch-link-item">
                  <p>Student? <br /> <a href="#" className="student-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('student'); }}>Student Login</a></p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Welcome Section for Admin */}
        <div className="welcome-section admin">
          <h2 className="slide-element">WELCOME!</h2>
          <p className="slide-element">Administrator Portal</p>
          <p className="slide-element">System Administration & Analytics</p>
        </div>

        {/* Student Login Panel - Slide Style (like Faculty/Admin) */}
        <div className="credentials-panel student">
              <h2 className="slide-element">Student Login</h2>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="field-wrapper slide-element error-message">
                    <div className="error-text">{error}</div>
                  </div>
                )}

                <div className="field-wrapper slide-element">
                  <input 
                    type="text" 
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    required 
                  />
                  <label>Register Number</label>
                  <i className="fa-solid fa-id-card"></i>
                </div>

                <div className="field-wrapper slide-element">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <label>Password</label>
                  <i className="fa-solid fa-lock"></i>
                </div>

                <div className="field-wrapper slide-element">
                  <button className="submit-button student-submit" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Login as Student'}
                  </button>
                </div>

                <div className="field-wrapper slide-element">
                  <button
                    type="button"
                    onClick={fillSampleCredentials}
                    className="sample-credentials-btn student-credentials-btn"
                  >
                    Use Sample Credentials
                  </button>
                </div>

                <div className="switch-link slide-element">
                  <div className="switch-links-container">
                    <div className="switch-link-item">
                      <p>Faculty Member? <br /> <a href="#" className="faculty-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('faculty'); }}>Faculty Login</a></p>
                    </div>
                    <div className="switch-link-item">
                      <p>Administrator? <br /> <a href="#" className="admin-trigger" onClick={(e) => { e.preventDefault(); switchLoginType('admin'); }}>Admin Login</a></p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

        {/* Welcome Section for Student */}
        <div className="welcome-section student">
          <h2 className="slide-element">WELCOME!</h2>
          <p className="slide-element">Student Portal</p>
          <p className="slide-element">Research & Academic Management</p>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="login-footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <div className="footer-copyright-section">
              <p className="footer-copyright">
                © <strong>2025</strong> Department Research Information Management System (<strong>DRIMS</strong>). All rights reserved.
              </p>
              <p className="footer-institution">
                VIGNAN'S Foundation for Science, Technology & Research (Deemed to be University)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;

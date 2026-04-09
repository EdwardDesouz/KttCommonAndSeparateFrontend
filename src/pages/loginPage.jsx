import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContex/userContex";
import API from "../api/api";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Logo from "../assets/images/KttLogo.png";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    logoutCheckbox: false,
  });
  const [errors, setErrors] = useState({ username: false, password: false });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      username: formData.username.trim() === "",
      password: formData.password.trim() === "",
    };
    setErrors(newErrors);
    setApiError("");
    if (newErrors.username || newErrors.password) return;

    setLoading(true);

    try {
      const res = await API.post("/loginUser/", {
        Username: formData.username,
        Password: formData.password,
        ChkLogin: formData.logoutCheckbox,
      });

      if (res.data.success) {
        login(formData.username); // store username in context
        console.log("Logged in username:", formData.username);
        navigate("/index");
      } else {
        setApiError(res.data.error || "Login Failed.");
      }
    } catch (err) {
      setApiError(err.response?.data?.error || "Login Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow className="no-gutters">
        <MDBCol col="6" className="left-form">
          <div className="text-center mb-4">
            <img src={Logo} style={{ width: "120px" }} alt="logo" />
          </div>

          {apiError && <p className="error-msg">{apiError}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.username && (
              <p className="error-msg">Please enter username</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.password && (
              <p className="error-msg">Please enter password</p>
            )}

            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="logoutCheckbox"
                name="logoutCheckbox"
                checked={formData.logoutCheckbox}
                onChange={handleChange}
              />
              <label htmlFor="logoutCheckbox" className="ms-2">
                Click here to Logout from another session with same ID
              </label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </MDBCol>

        <MDBCol col="6" className="right-info gradient-custom-2">
          <div className="p-4 text-white text-center">
            <h4 className="mb-4">We are more than just a company</h4>
             <p>
               Founded in 2026, Raven PTE LTD has quickly become a leading
               provider of Trade Net Front-end Solutions in Singapore. With our
               proprietary software, including Trade Net Frontend Solution
               version 4.1, we have earned recognition and accreditation from
               Singapore Customs. Our Trade Net Frontend Solution is a
               cloud-based platform built with the latest technologies. It is
               designed to be user-friendly and efficient, offering features such
               as auto-completion, searchable table listings, and comprehensive
               reporting to make permit management easier for our clients. Raven
               provides a wide range of services to support businesses in import
               and export operations. These include processing all types of
               permits at standard prices, ensuring strict compliance with
               customs regulations, supporting electronic Certificates of Origin
               (COO), and offering timely and accurate permit processing. We
               guarantee cost and time savings on permit preparation, provide
               24/7 premium support including public holidays, and maintain AED
               (Automated Export Declaration) compliance. Our dedicated staff
               manages end-to-end client accounts, prepares customized reports on
               a weekly or monthly basis, and ensures seamless handling of all
               permit declarations. Additionally, we offer on-site and off-site
               customs declaration services 24/7, acting as the declaring agent
               for our customers to simplify the entire customs process.
             </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default LoginPage;

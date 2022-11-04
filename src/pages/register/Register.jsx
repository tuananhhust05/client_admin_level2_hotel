import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined
  });
  const [notify, setNotify] = useState(false);
  const [content, setContent]= useState("Đăng ký tài khoản không thành công")
  const navigate = useNavigate()
  
  // thay đổi dữ liệu cho state up lên 
  const handleChange = (e) => {
    // xử lý hay; lấy dữ liệu từ form, lắng nghe sự thay đổi, lấy ra dữ liệu thay đổi từ e, set tên trường bằng id 
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value })); // giữ nguyên các giá trị, chỉ thay đổi giá trị trong trường được chỉ định
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if((credentials.username)&&(credentials.password)&&(credentials.confirm_password)&&(credentials.email)&&(String(credentials.password)===String(credentials.confirm_password))){
        console.log("hợp lệ",credentials);
        const res = await axios.post("/auth/register",
          {
            username:credentials.username,
            email:credentials.email,
            img:"1",
            city:"1",
            country:"1",
            phone:"1",
            password:credentials.password,
          }
        );
        console.log(res)
        if(res &&(res.data)&&(res.data.success)){
          navigate("/login");
        }
        else{
          setNotify(true);
          if(res && res.data && res.data.err){
             setContent(res.data.err);
          }
        }
    }
    else{
      setNotify(true);
    }
  };
  
  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
         <input
          type="password"
          placeholder="confirm password"
          id="confirm_password"
          onChange={handleChange}
          className="lInput"
        />
        <button onClick={handleClick} className="lButton">
          Register
        </button>
        <button onClick={()=>{navigate("/login")}} className="lButton">
          Login
        </button>
        {notify && <span>{content}</span>}
      </div>
    </div>
  );
};

export default Register;
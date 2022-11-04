import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
// component hiển thị và tạo mới dữ liệu của user 
// truyền vào là dữ liệu cứng của danh sách user 
const New = ({ inputs, title }) => {
  const [file, setFile] = useState(""); // file laf 1 chuỗi 
  const [info, setInfo] = useState({});  // 1 object lưu dữ liệu đăng ký của user
  // cách thay đổi ngắn gọn => thông minh; lấy id của event làm tên trường cần thay đổi, lấy giá trị của event làm giá trị thay đổi 
  const handleChange = (e) => {
    // giữ lại toàn bộ và thay đổi giá trị 1 trường 
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  // click vào hàm này => bật file systerm => chọn ảnh => lưu ảnh => lưu thông tin user đăng ký.
  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData(); // kiểu dữ liệu trong js 
    data.append("file", file); // chèn giá trị file 
    data.append("upload_preset", "upload"); // chèn dữ liệu cần upload 
    try {
      // đẩy form data lên 
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/lamadev/image/upload",
        data
      );
      // url lưu ảnh 
      const { url } = uploadRes.data;// lấy về url để truy cập vào dữ liệu vừa lưu 

      const newUser = {
        ...info,
        img: url, // thêm trường hình ảnh vào object info 
      };
      // api đăng ký để lưu tài khoản user 
      await axios.post("/auth/register", newUser);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(info);
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file) // nếu có file ảnh thì hiển thị file ảnh. 
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                {/* input chọn file  */}
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {/* hiển thị dữ liệu là danh sách user: dữ liệu cứng  */}
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              {/* upload dữ liệu user */}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;

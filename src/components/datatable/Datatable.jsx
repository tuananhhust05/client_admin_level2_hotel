import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {BedroomParent} from '@mui/icons-material'
import QuizIcon from '@mui/icons-material/Quiz';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';
// import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState ,useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const dateColumns = [
  {
    field: "time",
    headerName: "Time",
    width: 400,
    renderCell: (params) => (
      <div style={{display:"flex"}}>
          <DateRangeIcon/>
          <div style={{marginLeft:"5px"}}>
              {params.row.time}
          </div>
      </div>
    )
  }
];


const Datatable = ({columns}) => {
  const location = useLocation();
  let path = location.pathname.split("/")[1]; // muốn hiểu thì xem chỗ app config router; path thay đổi linh hoạt tùy vào chủng loại
  let namePage = path;
  const { user } = useContext(AuthContext);

  const [listHotel, setListHotel] = useState([]);  // dữ liệu bảng chính 
  const [listOrder, setListOrder] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listRoom, setListRoom] = useState([]);

  // hiển thị dữ liệu chi tiết
  const [listDataDetail,setListDataDetail] = useState([]);// dữ liệu hotels
  const [dataDetail,setDataDetail] = useState({});  // dữ liệu orders 
  const [dataDetailRoom,setDataDetailRoom] = useState({});
  const [detailUser,setDetailUser] = useState({});
  
  // data to link 
  const [dataToLinkHotel, setDataToLinkHotel] = useState("")
  // hiển thị danh sách những ngày đặt phòng (route rooms)
  const [openListUnavailableDates,setOpenListUnavailableDates] = useState(false);
  const [listUnavailableDates,setListUnavailableDates] = useState([]);
  const [inforRoomChosen,setInforRoomChosen] = useState("");

  // đóng mở form thông tin 
  const [showDetail,setShowDetail] = useState(false)
  if(String(path)==="hotels"){
    path = `${path}/gethotelbyowner/${user._id}`
  }
  else if( String(path)==="rooms"){
    path = `${path}/getroombyuserid/${user._id}`
  }
  else if(String(path) ==="orders"){
    path = `${path}/takelistorderbyownerid/orderpage/${user._id}`
  }
  else if(String(path) ==="users"){
    path = `${path}/takelistuserorderedbyownerid/${user._id}`
  }
  
 // const { data, loading, error } = useFetch(`/${path}`); // lấy dữ liệu 
  const { data } = useFetch(`/${path}`);
  useEffect(() => {
    if(data.length>0){
      console.log("Data nhận được khi call api",data)
      if(String(path.split("/")[0]) === "hotels"){
        setListHotel(data); 
      }
      else if (String(path.split("/")[0]) === "orders"){
        setListOrder(data);
      }
      else if (String(path.split("/")[0]) === "users"){
        setListUser(data);
      }
      else if (String(path.split("/")[0]) === "rooms"){
        setListRoom(data);
      }
    }
  }, [data]);
  console.log(listUser)
  // chống khởi tạo hàm nhiều lần vì trong hàm sử dụng các state bị thay đổi và hai hàm không bao giờ bằng nhau 
  const handleOnClick= useCallback( async (rowData) => {
    if(String(path.split("/")[0]) === "hotels"){
        console.log(rowData);
        setShowDetail(true);
        setDataToLinkHotel(rowData._id)
        let result = await axios.get(`/rooms/getroombyhotelowner/${rowData._id}`);
        setListDataDetail(result.data.result);
    }
    else if (String(path.split("/")[0]) === "orders"){
        console.log(rowData);
        setShowDetail(true);
        setDataDetail(rowData)
    }
    else if (String(path.split("/")[0]) === "rooms"){
      console.log(rowData);
      setShowDetail(true);
      setDataDetailRoom(rowData.roomNumbers)
    }
    else if (String(path.split("/")[0]) === "users"){
      console.log(rowData);
      let result = await axios.get(`/users/takeinforuserbymail/${rowData._id}`);
      console.log(result)
      setShowDetail(true);
      setDetailUser(result.data.data.userinfor)
    }
  })
  
  // hàm show danh sách phòng đã cho thuê của 1 room chỉ khi hiển thị danh sách room mới có 
  const handleShowListUnavailableDates = useCallback( async (data) =>{
    console.log(data);
    let result = await axios.get(`orders/TakeUnAvailableDateByOrderRoomId/${data._id}`);
    let listDate =[];
    let id= 1;;
    for( let i=0; i<result.data.length; i++){
      let a ={};
      // {new Date(params.row.time).getDate()}/{new Date(params.row.time).getMonth()+1}/{new Date(params.row.time).getFullYear()}
      a.time = `${new Date(result.data[i].FirstDayServe).getDate()}/${new Date(result.data[i].FirstDayServe).getMonth()+1}/${new Date(result.data[i].FirstDayServe).getFullYear()}--${new Date(result.data[i].LastDayServe).getDate()}/${new Date(result.data[i].LastDayServe).getMonth()+1}/${new Date(result.data[i].LastDayServe).getFullYear()}`
      a._id=id;
      listDate.push(a);
      id++;
    }
    setOpenListUnavailableDates(true);
    setInforRoomChosen(data.number)
    setListUnavailableDates(listDate);
  })
  // ẩn thông tin các form 
  const handleHideInfor = useCallback(()=>{
    setShowDetail(false);
    setOpenListUnavailableDates(false)
  })
  // const handleDelete = async (id) => { // xóa dữ liệu 
  //   try {
  //     await axios.delete(`/${path}/${id}`);
  //     setList(list.filter((item) => item._id !== id));
  //   } catch (err) {}
  // };
  // đây là 1 mảng, chứa 1 object 
  // const actionColumn = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     width: 200,
  //     // 1 trường có giá trị là một function component 
  //     renderCell: (params) => {
  //       return (
  //         <div className="cellAction">
  //           <Link to="/users/test" style={{ textDecoration: "none" }}>
  //             <div className="viewButton">View</div>
  //           </Link>
  //           <div
  //             className="deleteButton"
  //             onClick={() => handleDelete(params.row._id)}
  //           >
  //             Delete
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  // ];
  return (
    <div>
        {showDetail &&
          <div onClick={()=>handleHideInfor()} className="brother">
          </div>
        }
        <div className="datatable">
          {
            openListUnavailableDates && 
            <div className="listdateordered">
                 <h3>
                     Danh sách ngày đã cho thuê phòng {inforRoomChosen}
                     <CloseIcon className="close_icon" onClick={()=>setOpenListUnavailableDates(false)}/>
                 </h3>
                 {/* phải set up chiều dài của thẻ chứa datagrid Không là lỗi lòi ra */}
                 <div className="container_datagrid">  
                    <DataGrid
                      className="datagrid"
                      rows={listUnavailableDates}
                      columns={dateColumns}
                      pageSize={9}
                      checkboxSelection
                      rowsPerPageOptions={[9]}
                      getRowId={(row) => row._id}
                      onRowClick={(param) => handleOnClick(param.row)}
                    />
                  </div>
            </div> 
          }
          {showDetail && 
            <div className="listroom" >
              {  // header 
                (String(path.split("/")[0]) === "hotels") ?(
                  <h3>
                      ListCategory({listDataDetail.length})
                  </h3>
                ):( // logic lồng 
                  <div>
                      {
                        (String(path.split("/")[0]) === "orders") ? (
                          <h3>
                              Detail 
                          </h3>
                        ):(
                          <h3>
                             <div>Detail</div>
                          </h3>
                        )
                      }
                  </div>
                )
              }
              {/* content*/}
              {
                (String(path.split("/")[0]) === "hotels") ?(
                  <div>
                    {listDataDetail.map(item =>
                        <div className="elementData">
                            <BedroomParent/>
                            <div className="elementContent">{item.desc}</div>
                        </div>
                        )
                    }
                    <Link to={`/hotels/${dataToLinkHotel}`} className="link">
                        <div style={{display:"flex", margin:"10px"}}>
                            <QuizIcon style={{color: "rgba(46, 138, 206, 0.7)"}}/> 
                            <p  style={{color: "rgba(46, 138, 206, 0.7)"}} >More Infor</p>
                        </div>
                    </Link>
                  </div>
                ):( // logic lồng 
                  <div>
                       {(String(path.split("/")[0]) === "orders")&&
                          (
                            <div className="content_order">
                              <div className="content_order_left">
                                  <div className="element_orders">
                                    <div>Hotel: </div>
                                    <div>{dataDetail.HotelName}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Service: </div>
                                    <div> {dataDetail.CategoryRoomDesc}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Room Number: </div>
                                    <div> {dataDetail.IdRoomNumber}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Date:</div>
                                    <div>
                                    
                                          <div> 
                                                  <div>
                                                    {new Date(dataDetail.FirstDayServe).getDate()}/{new Date(dataDetail.FirstDayServe).getMonth()+1}/{new Date(dataDetail.FirstDayServe).getFullYear()}--{new Date(dataDetail.LastDayServe).getDate()}/{new Date(dataDetail.LastDayServe).getMonth()+1}/{new Date(dataDetail.LastDayServe).getFullYear()}
                                                  </div>
                                          </div>
                                      
                                    </div>
                                  </div>
                                  <div className="element_orders">
                                    <div>DateOrder: </div>
                                    <div>
                                        {new Date(dataDetail.DateOrder).getDate()}/{new Date(dataDetail.DateOrder).getMonth()+1}/{new Date(dataDetail.DateOrder).getFullYear()}
                                    </div>
                                  </div>
                              </div>
                              <div className="content_order_right">
                                  {/* <img alt="" src="https://luv.vn/wp-content/uploads/2021/10/gai-xinh-12.jpg"/> */}
                                  <img alt={dataDetail.NameUserOrder} src={dataDetail.ImgUserOrder}/>
                                  <div className="element_orders">
                                    <div>Name: </div>
                                    <div>{dataDetail.NameUserOrder}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Email: </div>
                                    <div>{dataDetail.EmailUserOrder}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Phone: </div>
                                    <div>{dataDetail.PhoneUserOrder}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Phone Extra: </div>
                                    <div>{dataDetail.PhoneContactExtra}</div>
                                  </div>
                              </div>
                            </div>
                          )
                       }
                       {(String(path.split("/")[0]) === "users")&&
                          (
                            <div className="content_order">
                              <div className="content_order_left">
                                  <div className="element_orders">
                                    <div>UserName: </div>
                                    <div>{detailUser.username}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Email: </div>
                                    <div> {detailUser.email}</div>
                                  </div>
                              </div>
                              <div className="content_order_right">
                                  <img alt={detailUser.username} src={detailUser.img}/>
                                  <div className="element_orders">
                                    <div>City: </div>
                                    <div>{detailUser.city}</div>
                                  </div>
                                  <div className="element_orders">
                                    <div>Country: </div>
                                    <div> {detailUser.country}</div>
                                  </div>
                              </div>
                            </div>
                          )
                       }
                       {
                        (String(path.split("/")[0]) === "rooms") &&(
                          <div>
                              {dataDetailRoom.map(item =>
                                <div key={item._id} className="elementData">
                                    <BedroomParent/>
                                    <div onClick={()=>handleShowListUnavailableDates(item)} className="elementContent">{item.number}</div>
                                </div>
                              )}
                          </div>
                        )
                       }
                  
                  </div>
                )
              }
            </div>
          }
          <div className="datatableTitle">
            {namePage}
            {/* đọc từ file app để nắm được luồng  */}
            <Link to={`/${path}/new`} className="link">
              Add New
            </Link>
          </div>
          {
            (String(path.split("/")[0]) === "hotels") && (
              <DataGrid
                className="datagrid"
                rows={listHotel}
                columns={columns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row._id}
                onRowClick={(param) => handleOnClick(param.row)}
              />
            )
          }
          {
            (String(path.split("/")[0]) === "orders") && (
              <DataGrid
                className="datagrid"
                rows={listOrder}
                columns={columns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row._id}
                onRowClick={(param) => handleOnClick(param.row)}
              />
            )
          }
          {
            (String(path.split("/")[0]) === "users") && (
              <DataGrid
                className="datagrid"
                rows={listUser}
                columns={columns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row._id}
                onRowClick={(param) => handleOnClick(param.row)}
              />
            )
          }
          {
            (String(path.split("/")[0]) === "rooms") && (
              <DataGrid
                className="datagrid"
                rows={listRoom}
                columns={columns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row._id}
                onRowClick={(param) => handleOnClick(param.row)}
              />
            )
          }
        
      </div>
    </div>
  );
};

export default Datatable;

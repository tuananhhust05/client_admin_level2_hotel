import "./comment.scss";

const Comment = ({nameuser,imgsource,content,time}) => {
  return (
    <div className="commentEle">
        <div className="header_commentEle">
            <span class="header_commentEle_child">
                <img className="img_commentEle" src={imgsource} alt={nameuser} />
                <div className="name">
                    {nameuser}
                </div>
            </span>
        </div>
        <div className="content_commentEle_wrapper">
          <p className="content_commentEle">
              {content}
          </p>
          <div className="time">
              <div className="hours">
                  <p>{`${new Date(time).getHours()}:${new Date(time).getMinutes()}`}</p>
                  <p className="day">
                      {`${new Date(time).getDate()}-${new Date(time).getMonth(time)+1}-${new Date(time).getFullYear(time)}`}
                  </p>
              </div>
          </div>
        </div>
    </div>
  );
};

export default Comment;

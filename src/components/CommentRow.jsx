import { Link } from "react-router-dom";

export default function CommentRow(props){
    return (
        <div className="dataRow">
            <div>
                <div className="units" style={{float:"right"}}>
                    <p className="other">upvotes: {props.upvotes}</p>
                    <p className="other">downvotes: {props.downvotes}</p>
                </div>
                <div>
                    <p style={{ margin:"20px 0px 0px 10px"}}>{props.content}</p>
                </div>
                <div className="bottomRightContainer">
                    <button className="bottomRightButton">Update</button>
                </div>
            </div>
        </div>
    );

}
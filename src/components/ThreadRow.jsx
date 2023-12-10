import { Link } from "react-router-dom";

export default function ThreadRow(props){
    return (
        <Link to={`/Comments/${props.id}`}>
            <div className="dataRow">
                <div>
                    <div className="units">
                        <h5>{props.name}</h5>
                    </div>
                    <div className="units" style={{float:"right"}}>
                        <p className="other">upvotes: {props.upvotes}</p>
                        <p className="other">downvotes: {props.downvotes}</p>
                    </div>
                </div>
            </div>
        </Link>
    );

}
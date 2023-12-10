import { Link } from "react-router-dom";

export default function PageRow(props){
    return (
        <Link to={`/Threads/${props.id}`}>
            <div className="dataRow">
                <div>
                    <div className="units">
                        <h5>{props.name}</h5>
                    </div>
                    <div className="units" style={{float:"right"}}>
                        <p className="other">category: {props.category}</p>
                    </div>
                </div>
                <div>
                    <p>{props.description}</p>
                </div>
            </div>
        </Link>
    );

}
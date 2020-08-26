import React, {Component} from "react";
import {Link} from "react-router-dom";


export default class ModelButtons extends Component {

    render() {
        return (
            <div className='align-items-center d-flex justify-content-around'>
                <Link to="/all-contacts">
                    <button className="btn btn-modal-a">All Contacts</button>
                </Link>
                <Link to="/us-contacts">
                    <button className="btn btn-modal-b">US Contacts</button>
                </Link>
                <Link to='/'>
                    <button className="btn btn-modal-close">Close</button>
                </Link>
            </div>
        );
    }
}

import React, {Component} from "react";
import './home.scss'
import ModalA from "../../components/modal-a/modal-a";
import ModalB from "../../components/modal-b/modal-b";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class Home extends Component {

    render() {
        return (
            <Router>
                <div className="row" style={{"height": '100vh'}}>
                    <div className="col-md-12 align-items-center d-flex justify-content-around">
                        <Link to="/all-contacts">
                            <button className='btn btn-modal-a' type="button">Button A</button>
                        </Link>
                        <Link to="/us-contacts">
                            <button className='btn btn-modal-b' type="button">Button B</button>
                        </Link>
                    </div>
                </div>
                <Switch>
                    <Route path='/all-contacts'>
                        <ModalA/>
                    </Route>
                    <Route path='/us-contacts'>
                        <ModalB/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default Home;

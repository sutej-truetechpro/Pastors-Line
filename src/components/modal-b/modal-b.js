import React, {Component} from "react";
import ModelButtons from "../model-buttons";
import { Scrollbars } from 'react-custom-scrollbars';
import {Link} from "react-router-dom";
import axios from "axios";
import Config from "../../config/config";

class ModalB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: '',
            isChecked: false,
            contactsDOM: [],
            searchQuery: '',
            page: 1
        };
        this.handleChecked = this.handleChecked.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }


    async getUSContacts() {
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&countryId=226`;
        let response = await axios.get(url, {
            headers: {
                Authorization: Config.token
            }
        });
        console.log(response);
        this.setState({contacts: response.data.contacts});
        this.getContacts();
    }

    handleChecked(e) {
        e.persist();
        console.log('e', e.target.checked);
        this.setState({isChecked: e.target.checked}, () => {
            this.getContacts();
        });
    }

    getContacts() {
        let items = []
        if (this.state.contacts && typeof(this.state.contacts) === 'object') {
            let obj = this.state.contacts.contacts;
            for (let key of Object.keys(obj)) {
                if (this.state.isChecked && obj[key].id % 2 === 0) {
                    items.push(obj[key]);
                } else if (!this.state.isChecked) {
                    items.push(obj[key]);
                }
            }
            this.setState({contactsDOM: items});
        }
    }

    async filter(e) {
        e.persist();
        this.setState({
            page: 1,
            searchQuery: e.target.value
        });
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&countryId=226&query=${e.target.value}`;
        let response = await axios.get(url, {
            headers: {
                Authorization: Config.token
            }
        });
        console.log(response);
        this.setState({contacts: response.data.contacts});
        this.getContacts();
    }

    componentWillMount() {
        this.getUSContacts()
    }

    handleScroll(e) {
        if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight) {
            this.paginationAPI()
        }
    }

    async paginationAPI() {
        this.setState({page: ++this.state.page})
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&countryId=226&query=${this.state.searchQuery}&page=${this.state.page}`;
        let response = await axios.get(url, {
            headers: {
                Authorization: Config.token
            }
        });
        let contacts = this.state.contacts;
        let data = response.data.contacts;
        for (let key of Object.keys(data)) {
            contacts[key] = data[key]
        }
        this.setState({contacts: contacts});
        this.getContacts();
    }

    render() {
        return (
            <div className="modal-b">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal B</h5>
                            <Link to='/'>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Link>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input type="text" className="form-control" id="search-modal-a"
                                       placeholder="Enter search query" onChange={(e) => this.filter(e)}/>
                            </div>
                            <div className='d-flex flex-column p-3'>
                                <Scrollbars style={{width: 'auto', height: 300}} onScroll={this.handleScroll}>
                                    {this.state.contactsDOM.length === 0 ?
                                        this.state.searchQuery === '' ? 'Loading ...' : 'Not Found' :
                                        this.state.contactsDOM.map((obj, index) => {
                                            return (<div key={index} className='border contact-card m-1 p-1'>
                                                <div>Id: {obj.id}</div>
                                                <div>Name: {obj.first_name}</div>
                                            </div>)
                                        })}
                                </Scrollbars>
                            </div>
                            <ModelButtons contactListType={this.props.contactListType} changeContactListType={this.props.changeContactListType}/>
                        </div>
                        <div className="modal-footer">
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="checkbox-even">
                                    <input type="checkbox" className="form-check-input"
                                           onChange={(e) => this.handleChecked(e)} id="checkbox-even"/>
                                    Only even
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalB;

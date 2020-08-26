import React, {Component} from "react";
import ModelButtons from "../model-buttons";
import {Scrollbars} from "react-custom-scrollbars";
import {Link} from "react-router-dom";
import axios from "axios";
import Config from "../../config/config";

let timeOut;

class ModalA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: '',
            isChecked: false,
            contactsDOM: [],
            searchQuery: '',
            page: 1,
            activeContact: '',
            isDataFetching: false
        };
        this.handleChecked = this.handleChecked.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    async getAllContacts() {
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171`;
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
        if (this.state.contacts && typeof (this.state.contacts) === 'object') {
            let obj = this.state.contacts;
            for (let key of Object.keys(obj)) {
                if (this.state.isChecked && obj[key].id % 2 === 0) {
                    items.push(obj[key]);
                } else if (!this.state.isChecked) {
                    items.push(obj[key]);
                }
            }
            this.setState({
                contactsDOM: items,
                isDataFetching: false
            });
        }
    }


    async filter(e) {
        e.persist();
        this.setState({
            page: 1,
            searchQuery: e.target.value
        });
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            this.getSearchData()
            this.setState({isDataFetching: true});
        }, 1000);
        if (e.key === 'Enter') {
            clearTimeout(timeOut);
            this.getSearchData()
            this.setState({isDataFetching: true});
        }

    }

    async getSearchData() {
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&query=${this.state.searchQuery}`;
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
        this.getAllContacts()
    }

    handleScroll(e) {
        if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight) {
            this.paginationAPI()
        }
    }

    async paginationAPI() {
        this.setState({
            isDataFetching: true,
            page: ++this.state.page
        });
        let url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&query=${this.state.searchQuery}&page=${this.state.page}`;
        let response = await axios.get(url, {
            headers: {
                Authorization: Config.token
            }
        });
        let contacts = this.state.contacts
        let data = response.data.contacts
        for (let key of Object.keys(data)) {
            contacts[key] = data[key]
        }
        this.setState({contacts: contacts});
        this.getContacts();
    }

    render() {
        return (<>
                <div className="modal-a">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal A</h5>
                                <Link to='/'>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </Link>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <input type="text" className="form-control" id="search-modal-a"
                                           placeholder="Enter search query" onKeyUp={(e) => this.filter(e)}/>
                                </div>
                                <div className='position-relative d-flex flex-column p-3'>
                                    <Scrollbars style={{width: 'auto', height: 300}} onScroll={this.handleScroll}>
                                        {this.state.contactsDOM.length === 0 ?
                                            this.state.searchQuery === '' ? 'Loading ...' : 'Not Found' :
                                            this.state.contactsDOM.map((obj, index) => {
                                                return (
                                                    <div key={index} className='border contact-card m-1 p-1'
                                                         onClick={() => this.setState({activeContact: obj})}
                                                            data-toggle="modal" data-target="#contact-modal-a">
                                                        <div>Id: {obj.id}</div>
                                                        <div>Name: {obj.first_name}</div>
                                                    </div>)
                                            })}
                                    </Scrollbars>
                                    {this.state.isDataFetching ? <div className='loading'><i
                                        className="fa fa-circle-o-notch fa-spin" style={{'fontSize': '30px'}}/></div>: null }
                                </div>
                                <ModelButtons contactListType={this.props.contactListType}
                                              changeContactListType={this.props.changeContactListType}/>
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
                <div className="modal fade" id="contact-modal-a" tabIndex="-1" role="dialog"
                     aria-labelledby="contact-modal-a" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Contact Detail</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>ID: {this.state.activeContact.id}</div>
                                <div>Name: {this.state.activeContact.first_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ModalA;

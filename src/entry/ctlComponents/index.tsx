import * as React from 'react';
import {connect} from 'react-redux';
import {
    SearchBar,
    List
} from 'antd-mobile';
import './index.less';
import {
    onSearchQuestionActionSuccess,
    onSearchAutoCompleteListActionSuccess
} from '../actions/actionType'
import axios from 'axios'

const Item = List.Item
interface IIndexCtlDataProps {
    searchList: string[],
    autoCompletionList: string[],
}

interface IIndexCtlCallbackProps {
    onSearchQuestion: (keyWord: string)=> void
    onSearchAutoCompleteList: (keyWord: string)=> void
}

interface IIndexCtlProps extends IIndexCtlCallbackProps, IIndexCtlDataProps{}


interface IIndexCtlState {
    keyWord: string
}
class IndexCtl extends React.PureComponent<IIndexCtlProps, IIndexCtlState> {
    public constructor(props) {
        super(props);
        this.state = {
            keyWord : '',
        }
    }
    public render() {
        const {
            searchList,
            autoCompletionList
        } = this.props;
        return (
            <div>
                <div>
                    <SearchBar 
                        placeholder = '请输入问题' 
                        // tslint:disable-next-line:jsx-no-lambda
                        onChange = {(val) => {this.setState({keyWord: val})}}
                        value = {this.state.keyWord}
                        // tslint:disable-next-line:jsx-no-lambda
                        onSubmit = {() => {this.props.onSearchQuestion(this.state.keyWord)}}
                    />
                    {this.renderList(searchList, '回答')}
                </div>
                {this.renderList(autoCompletionList, "自动提示")}
            </div>
        ) 
    }
    private renderList(list: string[], header: string) {
        if (list && list.length>0) {
            return (
                <div>
                    <List renderHeader = {() => header}>
                        {
                            list.map((item, index)=>{
                                return (
                                    <Item key={index}>{item}</Item>
                                )
                            })
                        }
                    </List>
                </div>
            )
        } else {
            return null;
        } 
    }
}

const mapStateToProps = (state: IIndexCtlProps) => {
    return {
        searchList: state.searchList,
        autoCompletionList: state.autoCompletionList,
    }
}

const mapDispatchToProps = (dispatch: any): IIndexCtlCallbackProps => {
    return {
        onSearchQuestion: (keyWord: string) => {
            axios.get('http://127.0.0.1:5000',{
                params: {
                    question: keyWord
                }
            }).then((result) =>{
                // tslint:disable-next-line:no-console
                const {data} = result;
                if (data.success) {
                    dispatch({type: onSearchQuestionActionSuccess, payload: data.answer});
                } else {
                    dispatch({type: onSearchQuestionActionSuccess, payload: null});
                }
            })
            
        },
        onSearchAutoCompleteList: (keyWord: string) => {
            axios.get('http://127.0.0.1:5000/autoComplete',{
                params: {
                    question: keyWord
                }
            }).then((result) =>{
                const {data} = result;
                if (data.success) {
                    dispatch({type: onSearchAutoCompleteListActionSuccess, payload: data.answer});
                } else {
                    dispatch({type: onSearchAutoCompleteListActionSuccess, payload: null});
                }
            })
        }
    }
}

export const IndexCtlFactory = connect(mapStateToProps, mapDispatchToProps)(IndexCtl);

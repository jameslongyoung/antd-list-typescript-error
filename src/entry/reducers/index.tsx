import {
    onSearchQuestionActionSuccess,
    onSearchAutoCompleteListActionSuccess
} from '../actions/actionType'
export const searchListReducer = (state = null, action: any): string[] | null => {
    if (action.type === onSearchQuestionActionSuccess) {
        return action.payload;
    } else {
        return state;
    }
}
export const searchAutoCompletionListReducer = (state = null, action): string[]| null => {
    if (action.type === onSearchAutoCompleteListActionSuccess) {
        return action.payload;
    } else {
        return state;
    }
}
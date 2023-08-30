import axios from 'axios'

/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */
exports.handler = async (event, context, callback) => {
    //1. Login
    const creds = {
        "email": "thealbertyang@gmail.com",
        "password": "test"
    };

    const auth = (await axios.post(`https://api.finances.fyi/users/auth`, creds)).data;
    if(!auth.success){
        throw new Error('Authentication Failed');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${auth.data.accessToken}`,
    }
    
    //2. Pull Monthly Payables Payments from airtable and add to Saved
    const distributeRoth = (await axios.get(`https://api.finances.fyi/finances/webbooks/aws/distributeRoth`, {headers})).data; 
    console.log(distributeRoth)
    if(!distributeRoth.success){
        throw new Error('Withdraw and deposit Roth failed.');
    }
     
};

const got = require('got');
const {XMLParser, XMLBuilder} = require('fast-xml-parser');

const parser = new XMLParser();
const builder = new XMLBuilder({});

const API_URL = process.env.NODE_ENV === 'test' ? 'https://019sms.co.il/papi/test' : 'https://019sms.co.il/api';
const xmlHeader = "<?xml version='1.0' encoding='UTF-8'?>";

class sms019 {

    /**
     * @param {String} token - The API token to use for all requests
     * @param {String=} source - The default source to use
     * @param {String=} username - The default user or sub user to use
     */
    constructor(token , source, username) {

        if (!token) throw new Error('token is required');

        this.token = token;
        this.username = username;
        this.source = source;

    }

    /**
     * @param {string=} xml - Complete XML ready for send
     * @param {(string|string[])=} destination - The destination number or array of numbers
     * @param {string=} message - The message body
     * @param {string=} source - The "from" field
     * @param {string=} username - The user to use
     * @returns {Promise<Response<Object>>} - The body of the API response as JSON
     */
    sendSMS({xml, destination, message, source, username}) {

        if (!xml)
            xml = this.generateXML({destination, message, source, username});

        return got.post(API_URL, {
            headers: {Authorization: 'Bearer ' + this.token},
            body: xml
        }).then(({body}) => parser.parse(body));

    }

    /**
     * @param {(string|string[])} destination - The destination number or array of numbers
     * @param {string} message - The message body
     * @param {string=} [source=default source] - The "from" field
     * @param {string=} [username=default user] - The user to use
     * @returns {string} - The XML format for the request
     */
    generateXML({destination, message, source, username}) {

        if (!username)
            username = this.username;

        const smsOptions = {
            sms: {
                user: username ? {username} : undefined,
                source: source || this.source || undefined,
                message,
                destinations: {
                    phone: destination
                },
            }
        }

        return xmlHeader + builder.build(smsOptions);
    }

    /**
     * Generates a new API token
     * @param {String} username - The master username
     * @param {String} password - The master password
     * @param {String=} apiUsername - The sub or master user this API token will be used for
     * @returns {Promise<Response<Object>>} - The body of the API response as JSON
     */
    static generateNewToken(username, password, apiUsername) {
        const authToken = {
            getApiToken: {
                user: {
                    username,
                    password
                },
                username: apiUsername || username,
                action: 'new'
            }
        }

        const xml = xmlHeader + builder.build(authToken);

        return got.post(API_URL, {body: xml})
            .then(({body}) => parser.parse(body));
    }
}

module.exports = sms019;

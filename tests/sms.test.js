const Sms = require('../index.js');

const sampleMessage = {
    destination: '0541234567',
    message: 'This is a test message',
    source: '0541234567',
    username: 'test'
}

describe('Testing SMS Class functions', () => {


    it('Throw error if no token', () => {
        expect(() => new Sms('')).toThrowError('token is required')
    });

    it('Initiate', () => {
        expect(new Sms('sample-token')).toBeInstanceOf(Sms)
    });

    it ('Generate xml data', () => {
        expect(new Sms('sample-token').generateXML(sampleMessage)).toEqual('<?xml version=\'1.0\' encoding=\'UTF-8\'?><sms><user><username>test</username>' +
            '</user><source>0541234567</source><message>This is a test message</message>' +
            '<destinations><phone>0541234567</phone></destinations></sms>')
    });

    it ('Return a promise', () => {
        expect(Sms.generateNewToken('test', 'test', 'test')).toBeInstanceOf(Promise);
    })

});

describe('Testing request', () => {

    const smsClass = new Sms('sample-token');
    let req;

    const expectedResult = {
        sms: {
            message: expect.any(String),
            status: expect.any(Number),
        }
    }

    it('Generate a got request', () => {
        req = smsClass.sendSMS(sampleMessage)
        expect(req).toBeInstanceOf(Promise);
    })

    it('Return a json object', async () => {
        const res = await req;
        expect(res).toMatchObject(expectedResult);
    } )
})

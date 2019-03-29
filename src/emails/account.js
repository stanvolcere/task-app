const sgmail = require('@sendgrid/mail');

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (emailAddress, name) => {
    sgmail.send({
        to: emailAddress,
        from: "svolcere10@gmail.com",
        subject: "Welcome to Task App!",
        text: `Thank you for joining Task App ${name}! Glad to have you join!`
        // using html is possible if you wish 
    });
};

const sendDeleteAccountEmail = (emailAddress, name) => {
    sgmail.send({
        to: emailAddress,
        from: "svolcere10@gmail.com",
        subject: "Leaving Task App?",
        text: `Sad to see you leave Task App ${name}! Anything we can do to keep you?`
        // using html is possible if you wish 
    });
}

// exporting multiple functions has to be done using an object
module.exports = {sendWelcomeEmail, sendDeleteAccountEmail};
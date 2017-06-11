const admin = require('firebase-admin');
const twilio = require('./twilio');


module.exports = function(req, res) {

if(!req.body.phone){
    res.status(422).send({ error: 'You must enter a valid phone number' });
}

const phone = String(req.body.phone).replace(/[^\d]/g, '');

admin.auth().getUser(phone)
.then(userRecord => {
const code = Math.floor((Math.random() * 8999 + 1000));

twilio.messages.create({
    body: 'Your code is ' + code,
    to: '+' + phone,
    from: '+16195361680'
}, err => {
    if(err){
        res.status(422).send({ error: err});
    }
    admin.database().ref('users/' + phone)
    .update({ code: code, codeValid: true }, () => {
        res.send({ success: true });
    });
});
})
.catch(err => {
    res.status(422).send({ error: err});
    //res.status(422).send({ error: 'User not found!'});
})

}
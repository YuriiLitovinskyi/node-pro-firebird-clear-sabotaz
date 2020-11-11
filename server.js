const Firebird = require('node-firebird');
const Confirm = require('prompt-confirm');

const question = new Confirm('Delete all sabotaz statuses from database?');

const options = {
    host: '127.0.0.1',
    port: 3050,
    database: 'Danube',
    user: 'SYSDBA',
    password: 'idonotcare',
    lowercase_keys: false,
    role: null
};

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

Firebird.attach(options, function(err, db){
    if(err) throw err;
    console.log('Connected to db successfully!');

    const countAllSabotazStatuses = `SELECT COUNT(*) FROM object_states WHERE STATE_NAME='SABOTAZ';`;

    const deleteAllSabotazQuery = `DELETE FROM object_states WHERE STATE_NAME='SABOTAZ';`;

    db.query(countAllSabotazStatuses, function(err, result){
        if(err) throw err;
        console.log(`Total devices with sabotaz status in database: ${result && result[0].COUNT}`);
        
        question.ask(function(answer){
            if(answer){
                db.query(deleteAllSabotazQuery, async function(err, result){
                    if(err) throw err;
                    console.log('All sabotaz statuses were removed from database successfully!');                   
                    db.detach();
                    await sleep(5000);
                });
            } else {
                db.detach();
            };
        });   
    });
});
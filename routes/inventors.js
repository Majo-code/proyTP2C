const express = require('express');
const expressJwt = require('express-jwt');
const router = express.Router();
const dataInventors = require('./../data/inventor');


const secret = ({secret: 'secret', algorithms: ['HS256']});

//Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

// listado de todos los inventors
// http://localhost:3000/api/inventors/
router.get('/', expressJwt(secret), async (req, res) =>{
    if(req.user.admin){
        res.json(await dataInventors.getAllInventors());
    }
    res.status(401).send({message: 'no autorizado'});
});


// http://localhost:3000/api/inventors/8
router.get('/:id', expressJwt(secret), async (req, res) =>{
    if(req.user.admin){    
        res.json(await dataInventors.getInventor(req.params.id));
    }
    res.status(401).send({message: 'no autorizado'});    
});

router.post('/', expressJwt(secret), async (req, res) => {
    if(req.user.admin){    
        const inventor = req.body;
        await dataInventors.pushInventor(inventor);
        const inventorPersistido = await dataInventors.getInventor(inventor._id); 
        res.json(inventorPersistido);
    }
    res.status(401).send({message: 'no autorizado'});       
});

router.put('/:id', expressJwt(secret), async (req, res) =>{
    if(req.user.admin){ 
        const inventor = req.body;
        inventor._id = req.params.id;
        await dataInventors.updateInventor(inventor);

        res.json(await dataInventors.getInventor(req.params.id));
    }
    res.status(401).send({message: 'no autorizado'}); 
});

router.delete('/:id', expressJwt(secret), async (req,res) => {
    if(req.user.admin){ 
        console.log('Delete');
        await dataInventors.deleteInventor(req.params.id);
        res.send('Inventor eliminado');
    }
    res.status(401).send({message: 'no autorizado'}); 
});

module.exports = router;

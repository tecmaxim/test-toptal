const dnaModel = require('../models/dna');
const dnasearch = require('../functions/checkIsMutant');

module.exports = app => {

  app.get('/mutant', (req, res) => {
    dnaModel.getDnas((err, data) => {
        if(!err)
        {
            res.status(200).json(data);
        }   
    });
  });

  app.post('/mutant', (req, res) => {
	  console.log('req:'+req.body.dna);
      
    let checkMutant = false;
    let status = 200;
    let varMsg = '';
	let dnaJson = req;
    ;
    if(dnaJson.body.dna != undefined && dnaJson.body.dna.length === dnaJson.body.dna[0].length)
    {
        dnasearch.checkIsMutante(dnaJson.body, (err, data) =>{
            if(data > 1)
            {    
               varMsg = 'Hewstone, tenemos un mutante!';
               status = 200
               checkMutant = true;

            }else{
                varMsg = 'Forbidden'
                status = 403
            }
            
            
            //guardamos el registro despues de comparar
            dnaModel.insertDna([null, dnaJson.body.dna.toString(),checkMutant ], (errInsert, data) => {
              if (!errInsert) {
                res.status(status).send({
                  success: true,
                  msg: varMsg,
                });				
              } else {
                 res.status(500).json({
                  success: false,
				  err: errInsert,                  
                });
              }
            });
            
            
        });
       
    }else{
        res.status(500).json({
              success: false,
              err: req,
              msg: "El json enviado no corresponde a una matriz de ADN valida",
            });
    }
  });
  
  app.get('/stats', (req, res) => {
    dnaModel.getStats((err, data) => {
		let ratio = 0;
        if(!err)
        {
			if(data[0].mutants > 0)
			{
				ratio = ((data[0].mutants * 100 /(data[0].mutants + data[0].human)) * 0.01)
			}
			
            res.status(200).json({"mutants": data[0].mutants, "human":data[0].human, "ratio":ratio});
        }   
    });
    
  });
  
    app.get('/test', (req, res) => {
    
        res.status(200).json({"test":"done"});
    });
  
};
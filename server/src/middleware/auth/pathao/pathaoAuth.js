import { ThirdPartyLogistic } from '../../../models/index.js';

const pathaoAuth = async (req, res, next) => {

  try {

    const logistic_id = req?.query?.logistic_id;


    // const bearer = req.headers.authorization || req.headers.Authorization;
    // if (!bearer || !bearer.startsWith('Bearer ')) {
    //   throw new BadRequestError('token not found');
    // }
    // const token = bearer.split('Bearer ')[1].trim();
    // const payload = await verifyAccessToken(token);
    // if (!payload) throw new BadRequestError('unauthorized');

    const logistic = await ThirdPartyLogistic.findByPk(logistic_id);

    const credentials = {
      client_id: 'GRb48YnbBL',
      client_secret: "TRyo2uXt2LJcsXEkHT6lUBG7ViBvOET2nITLZqW3",
      username: "support@isle.com.bd",
      password: "xhQsY6Goy",
      grant_type: 'password',
    };

    // Login
    const resAuth = await fetch(logistic.api_url + '/issue-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

      },
      body: JSON.stringify(credentials),
    });

    const resAuthJson = await resAuth.json();


    req.pathao = { ...logistic.dataValues, auth: resAuthJson };
    next();
  } catch (err) {
    next(err);
  }
};
export default pathaoAuth;

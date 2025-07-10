const User = require("../models/User");

const hashPassword = require("../utils/auth").hashPassword;
const comparePassword = require("../utils/auth").comparePassword;
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API)






exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password , confirmPassword } = req.body;

    let UserExiste = await User.findOne({
      email,
    }).exec();
    if (UserExiste)
      return res.status(400).json({
        statue: false,
        message: "Email déja utilisé ,essayer avec un autre !",
      });
      if (password.length < 8)
      return res.status(400).json({
        statue: false,
        message: "Minimum 8 caractére !",
      });
      //check match passwords
      if (password != confirmPassword)
        return res.status(400).json({
          statue: false,
          message:
            "Mot de passe et confirme mot de passe ne sont pas identiques !",
        });
       
    
        if ( nom === "" || prenom==="" || email==="" ) 
        return res.status(400).json({
          statue: false,
          message:
            " Vous devez remplir tous les champs!",
        });
    //hash Password
    const hashedPassword = await hashPassword(password);
    //const shortCode = nanoid(6).toUpperCase();

    const tokenn = nanoid(64);
  
    //creation de l'entité
    const user = new User({
      nom: nom,
      prenom: prenom,
      email: email,
      password: hashedPassword,
      emailToken: tokenn,
     

    });

    await user.save();
   


const tok = user.emailToken;

const msg = {
  to: user.email,
  from: 'fastuz@fastuz.com',
  subject: 'Vérifier votre compte',
  html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
        .u-row .u-col-100 {
          width: 600px !important;
        }
      }
      
      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col>div {
          margin: 0 auto;
        }
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
      
      p {
        margin: 0;
      }
      
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
      
      * {
        line-height: inherit;
      }
      
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
      
      table,
      td {
        color: #000000;
      }
      
      #u_body a {
        color: #e67e23;
        text-decoration: underline;
      }
      
      @media (max-width: 480px) {
        #u_content_image_1 .v-src-width {
          width: auto !important;
        }
        #u_content_image_1 .v-src-max-width {
          max-width: 36% !important;
        }
        #u_content_button_1 .v-size-width {
          width: 93% !important;
        }
      }
    </style>
  
  
  
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
    <!--<![endif]-->
  
  </head>
  
  <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ececf8;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ececf8;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
       <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ececf8;"><![endif]-->
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Lato',sans-serif;" align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1636434047367-bb.png" alt="border" title="border" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
                                        width="600" class="v-src-width v-src-max-width" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table id="u_content_image_1" style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 30px;font-family:'Lato',sans-serif;" align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                      <a href="#" target="_blank">
                                        <img align="center" border="0" src="https://assets.unlayer.com/projects/137674/1676292088427-logoFastuz.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 40%;max-width: 232px;"
                                          width="232" class="v-src-width v-src-max-width" />
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Lato',sans-serif;" align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1638247919624-uuu.jpg" alt="Hero Image" title="Hero Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
                                        width="600" class="v-src-width v-src-max-width" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #f7f7f7;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="background-color: #f7f7f7;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 40px;font-family:'Lato',sans-serif;" align="left">
  
                                <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: arial black,avant garde,arial; font-size: 28px; ">Vérification du compte Fastuz</h1>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f7f7f7;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f7f7f7;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 44px 30px;font-family:'Lato',sans-serif;" align="left">
  
                                <div style="color: #333333; line-height: 200%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 200%;">Merci d'avoir démarré le processus de création de compte <strong>Fastuz</strong>. Nous voulons nous assurer qu'il s'agit vraiment de vous. Veuillez cliquer dessous sur ce lien pour la vérification de votre compte Fastuz.</p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table id="u_content_button_1" style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
  
                                <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                <div align="center">
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${process.env.BACKOFFICE_DOMAIN}/verify-email/${tok}" style="height:57px; v-text-anchor:middle; width:331px;" arcsize="5.5%"  stroke="f" fillcolor="#2e3192"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Lato',sans-serif;"><![endif]-->
                                  <a href="${process.env.BACKOFFICE_DOMAIN}/verify-email/${tok}" target="_blank" class="v-button v-size-width" style="box-sizing: border-box;display: inline-block;font-family:'Lato',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #2e3192; border-radius: 3px;-webkit-border-radius: 3px; -moz-border-radius: 3px; width:57%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 16px;">
                                    <span style="display:block;padding:19px 30px;line-height:120%;"><span style="line-height: 19.2px;"><strong><span style="line-height: 19.2px;">Vérification</span></strong>
                                    </span>
                                    </span>
                                  </a>
                                  <!--[if mso]></center></v:roundrect><![endif]-->
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                      
  
                   
                    
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 30px 70px;font-family:'Lato',sans-serif;" align="left">
  
                                <div style="color: #333333; line-height: 190%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 190%;"><span style="font-size: 16px; line-height: 30.4px;">Merci pour votre confiance,</span></p>
                                  <p style="font-size: 14px; line-height: 190%;"><span style="font-size: 16px; line-height: 30.4px;"><strong>L'équipe Fastuz.</strong></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:'Lato',sans-serif;" align="left">
  
                                <div align="center">
                                  <div style="display: table; max-width:143px;">
                                    <!--[if (mso)|(IE)]><table width="143" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:143px;"><tr><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 16px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 16px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://www.linkedin.com/company/logimes" title="LinkedIn" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/squared-black/linkedin.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 16px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 16px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://zh-tw.facebook.com/people/Logimes/100076497543790/" title="Facebook" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/squared-black/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://www.instagram.com/logi_mes/?hl=fr" title="Instagram" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/squared-black/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px;font-family:'Lato',sans-serif;" align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="55%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:'Lato',sans-serif;" align="left">
  
                                <div style="color: #8d8c8c; line-height: 190%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 190%;">Si vous avez des questions, n'hésitez pas à nous envoyer un message à <span style="color: #2e3192; line-height: 26.6px;"><a rel="noopener" href="mailto:support@mailus.com" target="_blank" style="color: #2e3192;">fastuz@fastuz.com</a></span></p>
                                  <p style="font-size: 14px; line-height: 190%;"><span style="font-size: 14px; line-height: 26.6px;">Copyrights @Fastuz.</span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Lato',sans-serif;" align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1636435800013-footer%20curve.png" alt="border" title="border" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
                                        width="600" class="v-src-width v-src-max-width" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
  
  </html>
  `
            ,
};


sgMail
  .send(msg)
  .then(() => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      statue: true,
      token,
      message: "Ajout effectuée avec succès ",
    });
  })
  .catch((error) => {
    return res.status(400).send(error.message);
  });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};




exports.login = async (req, res) => {

  try {

    
    const { email, password } = req.body;
    if (email==="")
      return res
        .status(404)
        .json({ statue: false, message: "Le champ d'email est manquant" });
        if (password==="")
        return res
          .status(404)
          .json({ statue: false, message: "Le champ du password est manquant" });
  
    //check if db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user)
      return res
        .status(404)
        .json({ statue: false, message: "Utilisateur non enregistré" });
    //check password
   if (user.active===false)
        return res
          .status(404)
          .json({ statue: false, message: "Votre compte est expiré" });
 
       

    const match = await comparePassword(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ statue: false, message: "Mot de passe erroné" });

       

 const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});



user.token = token;
await user.save();

res.cookie("token", token);

res.json({
  statue: true,
  user: user,
  token: token,
});

  }catch (err) {
    return res.status(400).send(err.message);
  }

};

exports.getUserByToken = async (req, res) => {
  const token = req.body.token;

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data.userId)
      .select("-password")
     
      .exec();
      console.log("Token from client:", token);
console.log("Token in DB:", user.token);

    if ( user.token !== token) {
      res.clearCookie("token");
      throw new Error("Vous êtes déjà connecté!");
    }
 

    return res.json({ user: user });
  } catch (err) {
    return res.status(400).send("Error. Try again " + err.message);
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;  // or get token from req.header/req.body
    if (!token) return res.status(401).json({ message: "No token found" });

    // Decode token to get user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID and clear token
    await User.findByIdAndUpdate(data.userId, { token: "" });

    // Clear token cookie on client
    res.clearCookie("token");

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Logout failed" });
  }
};


exports.getPublicUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("nom prenom username photo restauName role")
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé à ces détails.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de l'utilisateur public:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'utilisateur." });
  }
};



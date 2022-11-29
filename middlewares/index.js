const validateFields = require('./validate-fields');
const validateRoles = require('./validate-roles');
const validateJWT = require('./validate-jwt');

module.exports = {
    ...validateJWT,
    ...validateFields,
    ...validateRoles,
}
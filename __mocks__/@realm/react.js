// Mock de @realm/react para pruebas unitarias
const React = require('react');

const useRealm = jest.fn();
const useQuery = jest.fn(() => []);
const useObject = jest.fn(() => null);

const RealmProvider = ({ children }) => React.createElement(React.Fragment, null, children);

module.exports = {
    useRealm,
    useQuery,
    useObject,
    RealmProvider,
};

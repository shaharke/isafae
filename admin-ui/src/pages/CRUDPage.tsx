import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

// Data provider pointing to NestJS API
const dataProvider = simpleRestProvider('http://localhost:3000/api/admin');

export const CRUDPage = () => (
    <Admin dataProvider={dataProvider} basename="/admin">
        {/* Sessions Resource */}
        <Resource
            name="sessions"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />

        {/* Prompts Resource */}
        <Resource
            name="prompts"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />

        {/* Functions Resource */}
        <Resource
            name="functions"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />

        {/* Executions Resource */}
        <Resource
            name="executions"
            list={ListGuesser}
            show={ShowGuesser}
        />
    </Admin>
);

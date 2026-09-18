import neo4j, { Driver, Session } from 'neo4j-driver';

const uri =
  process.env.NEO4J_URI && !process.env.NEO4J_URI.includes('<your-instance-id>')
    ? process.env.NEO4J_URI
    : 'bolt://localhost:7687';

const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'SecurePass123';

const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const getNeo4jSession = (): Session => driver.session();

module.exports = `
  input UserInput {
    username: String
    email: String
    state: String
    type: String
  }

  input RoleInput {
    app_id: Int!
    name: String!
    description: String!
    state: String
  }

  input UserRoleInput {
    role_id: Int!
    user_id: Int!
    state: String
  }

  input AppInput {
    name: String!
    description: String!
  }

  type UserRole {
    role_id: Int
    user_id: Int
    state: String
  }


  type Role {
    id: Int
    app_id: Int
    name: String
    description: String
    state: String
  }

  type User {
    id: Int
    user_id: Int
    username: String
    email: String
    state: String
    type: String
    roles:[Role]
  }

  type App {
    id: Int
    app_id: Int
    name: String
    description: String
  }

  type Query {
    getUser(user_id: ID!): User
    getUserRole(user_id:ID!): [UserRole]
    getApp(app_id: ID): App
    getRole(app_id: ID, role_id: ID): [Role]
    users:[User]
    roles:[Role]
    apps:[App]
  }

  type Mutation {
    createUser(input: UserInput): User
    createApp(input: AppInput): App
    createRole(input: RoleInput): Role
    createUserRole(input: UserRoleInput): UserRole
    updateUser(user_id: ID!, input: UserInput): User
    updateApp(app_id: ID!): App
    updateRole(role_id: ID!): Role
    
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
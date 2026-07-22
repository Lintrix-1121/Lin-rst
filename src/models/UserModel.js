class User {
  constructor({ userId, userName, email, provider }) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.provider = provider;
  }

  static fromJSON(data) {
    return new User(data);
  }

  //helper methods
  get displayName() {
    return this.userName || this.email;
  }
}

export default User;
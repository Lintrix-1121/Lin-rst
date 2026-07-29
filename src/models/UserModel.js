class User {
  constructor({ userId, userName, email, provider, 
    providerId, createdAt, updatedAt, profilePicture,
    lastLoginAt, isActive
  }) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.provider = provider;
    this.providerId = providerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.profilePicture = profilePicture;
    this.lastLoginAt = lastLoginAt;
    this.isActive = isActive;
  }

  static fromJSON(data) {
    return new User({
      userId: data.userId || data.id,
      userName: data.userName || data.name,
      email: data.email,
      provider: data.provider,
      providerId: data.providerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      profilePicture: data.profilePicture || data.picture,
      lastLoginAt: data.lastLoginAt,
      isActive: data.isActive,
    });
  }

  //helper methods
  // get displayName() {
  //   return this.userName || this.email;
  // }
}

export default User;
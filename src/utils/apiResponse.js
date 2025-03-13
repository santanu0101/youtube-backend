class apiResponnse {
  constructor(statusCode, data, messgae = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = messgae;
    this.success = statusCode < 400;
  }
}

export { apiResponnse }
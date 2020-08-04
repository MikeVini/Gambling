# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
MAJOR version when you make incompatible API changes,
MINOR version when you add functionality in a backwards compatible manner, and
PATCH version when you make backwards compatible bug fixes.

## [Unreleased]
- Replenishment of the client 's account
- Notification of payments in Gambling
- Migration

## [0.8.5] - 2020-05-07

### Added
- Comments in code
- Test empty create

### Change
- Checking for existence transaction

## [0.7.5] - 2020-05-06
### Added
- Header DATE-TIME for signing requests
- Tasks module
- Transaction in Gambling
- Transaction in Exchange 
- Check new Transaction
- Send new Transaction

### Change
- Date-time header
- Fix tasks
- Fix get transaction 

## [0.5.4] - 2020-04-24

### Added
- Create client/user in exchange
- Transaction controller

### Change
- Delete module Cognito, moved to exchange

## [0.4.3] - 2020-03-29

### Added
- Module Exchange
- Create TX in Gambling
- Get TX in Gambling

### Change
- Http Module, configure

## [0.3.2] - 2020-03-25

### Added
- Client registration
- User registration
- Cognito registration

### Change
- Logger Middleware
- HTTP exception filter 

## [0.2.1] - 2020-03-20

### Added
- Class UpdateClientDto for update client
- Request update for Client
- Request get for Client
- Role admin, client for controller Client 

### Change
- AuthGuard, validation logic 

## [0.1.1] - 2020-03-16

### Added
- Transaction module 
- Auto format code, cleanup code
- BalanceModule, ClientModule, UserModule
- Currency enum
- Default guard, header for swagger 

## [0.0.1] - 2020-03-06

### Added
- Nestjs, mysql, compodoc, swagger, basic setting
- README.md
- CHANGELOG.md
- CONTRIBUTING.md
- LICENSE.md
    
[Unreleased]:
- [0.7.5]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.7.5
- [0.5.4]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.5.4
- [0.4.3]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.4.3
- [0.3.2]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.3.2
- [0.2.1]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.2.1
- [0.1.1]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.1.1
- [0.0.1]: git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/neuron-gambling-backend --branch v0.0.1
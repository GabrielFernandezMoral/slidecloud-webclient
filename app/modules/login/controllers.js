var module = angular.module('app.modules.login.controllers', []);

module.controller('loginController', ['$scope', '$location', 'loginService', 'authService', loginController]);

function loginController ($scope, $location, loginService, authService) {

	$scope.login = login;
	$scope.logout = logout;
	$scope.createAccount = createAccount;
	$scope.switchLoginCreateAccountView = switchLoginCreateAccountView;
	$scope.proceedMainAction = proceedMainAction;
	$scope.proceedValidateAccount = proceedValidateAccount;

	$scope.loginMode = true;
	$scope.createAccountMode = false;
	$scope.switchModeButtonText = 'Create account';
	$scope.mainButtonText = 'Log in';
	$scope.username = authService.getUsername();
	$scope.validationUsername = $location.search().username;
	$scope.validationToken = $location.search().token;

	if($scope.validationUsername && $scope.validationToken) {
		$scope.proceedValidateAccount();
	}

	function proceedValidateAccount () {
		loginService.validateAccount($scope.validationUsername, $scope.validationToken).then(onValidateAccountResponse);
	};

	function onValidateAccountResponse (response) {
		if(response.status !== 200) {
			var modalTitle = 'Problem validating account',
				modalMessage = 'We could not validate your account. Please, verify you copied the link just like we sent you in the email.';
			showModal(modalTitle, modalMessage);
		} else {
			var modalTitle = 'Account validated successfully!',
				modalMessage = 'You can now login with your credentials and start using Slide Cloud.';
			showModal(modalTitle, modalMessage);
		}
	};

	function proceedMainAction () {
		if($scope.loginMode) {
			login();
		} else {
			createAccount();
		}
	};

	function login () {
		loginService.login($scope.username, $scope.pass).then(onLoginResponse);
	};

	function onLoginResponse (response) {
		if(response.status === 200) {
			authService.saveTokenAndUsername(response.data);
			$location.path('/dashboard');
		} else {
			$location.path('/login');
		}
	};

	function logout () {
		authService.removeTokenAndUsername();
		$location.path('/login');
	};

	function createAccount () {
		loginService.signin($scope.username, $scope.pass, $scope.email).then(onCreateAccountResponse, onCreateAccountResponse);
	};

	function onCreateAccountResponse (response) {
		var modalTitle, modalMessage;

		if (response.status === 401) {
			modalTitle = 'Username already taken';
			modalMessage = 'There is already an user account with that username. Please, choose a different one and try again.';
		} else if (response.status === 200) {
			modalTitle = 'Account created successfully!';
			modalMessage = 'You will receive an email with a link to validate your account. You need to validate it before you login. Enjoy Slidecloud.';
		} else {
			modalTitle = 'Ups...!';
			modalMessage = 'It seems there was some error creating your account. You might try to change credentials and try again.';
		}

		showModal(modalTitle, modalMessage);
	};

	function switchLoginCreateAccountView () {
		if($scope.loginMode) {
			$scope.loginMode = false;
			$scope.createAccountMode = true;
			$scope.switchModeButtonText = 'Log in';
			$scope.mainButtonText = 'Create account';
		} else {
			$scope.loginMode = true;
			$scope.createAccountMode = false;
			$scope.switchModeButtonText = 'Create account';
			$scope.mainButtonText = 'Log in';
		}
	};

	function showModal (title, message) {
		$scope.modalTitle = title;
		$scope.modalMessage = message;
		$('#createAccountModal').modal('show');
	};
};
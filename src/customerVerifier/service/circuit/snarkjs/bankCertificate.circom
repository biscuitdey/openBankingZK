pragma circom 2.1.5;

include "../../../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../../../node_modules/circomlib/circuits/eddsa.circom";
include "./utils/arithmeticOperators.circom";

template bankCertificate(){
	signal input privateName;
	signal input publicName;
	signal input privateBankName;
	signal input publicBankName;
	signal input privateAccountNumber;
	signal input publicAccountNumber;
	signal input privateIFSC;
	signal input publicIFSC;

	//Signature inputs
	signal input message[256];
    	signal input A[256];
   	signal input R8[256];
    	signal input S[256];

	signal output isVerified;

   	//1. Verify Name
	component nameVerifier = IsEqual();

	nameVerifier.in[0] <== privateName;
	nameVerifier.in[1] <== publicName;	
	
	var isNameVerified = nameVerifier.out;

	//2. Verify Bank Name
	component bankNameVerifier = IsEqual();

	bankNameVerifier.in[0] <== privateBankName;
	bankNameVerifier.in[1] <== publicBankName;	
	
	var isBankNameVerified = bankNameVerifier.out;

	//3. Verify Account Number
	component accountNumberVerifier = IsEqual();

	accountNumberVerifier.in[0] <== privateAccountNumber;
	accountNumberVerifier.in[1] <== publicAccountNumber;	
	
	var isAccountNumberVerified = accountNumberVerifier.out;

	//4. Verify IFSC
	component ifscVerifier = IsEqual();

	ifscVerifier.in[0] <== privateIFSC;
	ifscVerifier.in[1] <== publicIFSC;	
	
	var isIFSCVerified = ifscVerifier.out;


	//5. Verify Eddsa signature
	var verifiedFlag = 0;
	component eddsaSignatureVerifier = EdDSAVerifier(256);
	for(var i = 0; i < 256; i++){
		eddsaSignatureVerifier.msg[i] <== message[i];
		eddsaSignatureVerifier.A[i] <== A[i];
		eddsaSignatureVerifier.R8[i] <== R8[i];
		eddsaSignatureVerifier.S[i] <== S[i];	
	}
	verifiedFlag = 1;
	component isEqualSignature = IsEqual();
	isEqualSignature.in[0] <== verifiedFlag;
	isEqualSignature.in[1] <== 1;
	var isSignatureVerified = isEqualSignature.out;	

	component mul = Mul(5);
	mul.nums[0] <== isNameVerified;
	mul.nums[1] <== isBankNameVerified;
	mul.nums[2] <== isAccountNumberVerified; 
	mul.nums[3] <== isIFSCVerified;
	mul.nums[4] <== isSignatureVerified;

	isVerified <== mul.result; 
	
}


//declaring the public inputs
component main {public [publicName,publicBankName, publicAccountNumber, publicIFSC]} = bankCertificate();
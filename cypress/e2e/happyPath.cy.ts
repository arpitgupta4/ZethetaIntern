describe('LendSwift: Loan Application Happy Path', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });

  it('successfully completes the 8-step application flow', () => {
    // 1. Step 1: Loan Details
    cy.get('select[name="loanType"]').select('Personal');
    cy.get('input[name="loanAmount"]').clear().type('600000'); 
    cy.get('input[name="loanTenure"]').clear().type('24');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 2. Step 2: Personal Info
    cy.get('input[name="fullName"]').clear().type('John Doe');
    cy.get('input[name="dob"]').clear().type('1990-01-01');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 3. Step 3: KYC
    // PAN
    cy.get('input[name="panNumber"]').clear().type('ABCPP1234P');
    cy.contains('div', 'PAN Number').find('button').click({ force: true });
    cy.get('svg[data-lucide="check-circle-2"]', { timeout: 10000 }).should('be.visible');

    // Aadhaar - Robust Entry
    cy.get('input[name="aadhaarNumber"]')
      .clear()
      .invoke('val', '123456789012')
      .trigger('input')
      .trigger('change')
      .trigger('blur');
    
    cy.contains('div', 'Aadhaar Number').find('button').click({ force: true });
    cy.get('svg[data-lucide="check-circle-2"]').should('have.length', 2);
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 4. Step 4: Address
    cy.get('input[name="pinCode"]').clear().type('400001');
    cy.get('input[name="city"]').should('not.have.value', '');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 5. Step 5: Employment
    cy.get('select[name="employmentType"]').select('Salaried');
    cy.get('input[name="monthlyIncome"]').clear().type('50000');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 6. Step 6: Co-Applicant
    cy.get('input[type="checkbox"]').check();
    cy.get('input[name="coApplicantName"]').clear().type('Jane Doe');
    cy.get('input[name="coApplicantPan"]').clear().type('ABCDE1234F');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // 7. Step 7: Documents
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-doc.pdf', { force: true });
    cy.contains('Review Application').click({ force: true });

    // 8. Step 8: Final Review
    cy.window().then((win) => { cy.stub(win, 'alert').as('alertStub'); });
    cy.get('input[name="termsAccepted"]').check();
    cy.contains('button', 'Submit Application').click({ force: true });
    cy.get('@alertStub').should('be.calledWith', 'Application Submitted Successfully!');
  });
});
describe('LendSwift: Loan Application Happy Path', () => {
  beforeEach(() => {
    // Navigate to the app and clear previous progress before the test starts
    cy.visit('/');
    cy.clearLocalStorage();
  });

  it('successfully completes the full 8-step application flow', () => {
    // --- Step 1: Loan Details ---
    cy.get('select[name="loanType"]').select('Personal');
    cy.get('input[name="loanAmount"]').clear().type('600000'); // > 5L triggers Step 6
    cy.get('input[name="loanTenure"]').clear().type('24');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // --- Step 2: Personal Info ---
    cy.get('input[name="fullName"]').clear().type('John Doe');
    cy.get('input[name="dob"]').clear().type('1990-01-01'); // 21+ years old
    cy.contains('button', 'Save & Continue').click({ force: true });

    // --- Step 3: KYC (Bulletproof DOM State Version) ---
    // 1. PAN Verification
    cy.get('input[name="panNumber"]')
      .click({ force: true })
      .clear()
      .type('ABCPP1234P', { delay: 50 })
      .should('have.value', 'ABCPP1234P');
    
    // Click the specific button associated with the PAN input
    cy.get('input[name="panNumber"]').parent().find('button').click({ force: true });
    // Wait for simulated API to lock the input
    cy.get('input[name="panNumber"]', { timeout: 10000 }).should('be.disabled');

    // 2. Aadhaar Verification
    cy.get('input[name="aadhaarNumber"]')
      .click({ force: true })
      .clear()
      .type('123456789012', { delay: 50 })
      .should('have.value', '123456789012');
    
    // Click the specific button associated with the Aadhaar input
    cy.get('input[name="aadhaarNumber"]').parent().find('button').click({ force: true });
    // Wait for simulated API to lock the input
    cy.get('input[name="aadhaarNumber"]', { timeout: 10000 }).should('be.disabled');

    cy.contains('button', 'Save & Continue').click({ force: true });

    // --- Step 4: Address ---
    cy.get('input[name="pinCode"]').clear().type('400001');
    // Ensure the auto-fill lookup finishes before continuing
    cy.get('input[name="city"]', { timeout: 5000 }).should('not.have.value', ''); 
    cy.contains('button', 'Save & Continue').click({ force: true });

    // --- Step 5: Employment ---
    cy.get('select[name="employmentType"]').select('Salaried');
    cy.get('input[name="monthlyIncome"]').clear().type('50000');
    cy.get('input[name="companyName"]').clear().type('Tech Corp');
    cy.contains('button', 'Save & Continue').click({ force: true });

    // --- Step 6: Co-Applicant ---
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.get('input[name="coApplicantName"]').clear().type('Jane Doe');
    cy.get('input[name="coApplicantPan"]').clear().type('ABCDE1234F');
    cy.contains('button', 'Save & Continue').click({ force: true });

// --- Step 7: Documents & E-Signature ---
    
    // 1. Upload the Document
    // Ensure you have a file named 'test-doc.pdf' inside the 'cypress/fixtures/' folder
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/test-doc.pdf', { force: true });

    // 2. Draw the E-Signature
    // We simulate a mouse drawing a "V" shape on the canvas
    cy.get('canvas')
      .scrollIntoView()
      // Click down to start the ink
      .trigger('mousedown', { button: 0, offsetX: 50, offsetY: 50, force: true })
      // Drag to draw
      .trigger('mousemove', { offsetX: 100, offsetY: 100, force: true })
      .trigger('mousemove', { offsetX: 150, offsetY: 50, force: true })
      // Release the mouse click
      .trigger('mouseup', { force: true });

    // Wait a brief moment to ensure the canvas saves its internal state
    cy.wait(500); 

    // Click the button to proceed to the final review
    cy.contains('button', 'Review Application').click({ force: true });
    // --- Step 8: Final Review & Submit ---
    // Stub the browser alert to capture it gracefully
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // Check the Terms & Conditions box
    cy.get('input[name="termsAccepted"]').check({ force: true });
    cy.contains('button', 'Submit Application').click({ force: true });
    
    // Assert the completion alert matches exactly
    cy.get('@alertStub').should('be.calledWith', 'Application Submitted Successfully!');
  });
});
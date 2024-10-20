// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Opportunity" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    // Use innerHTML to insert the quote and category into the quoteDisplay div
    document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
  }
  
  // Function to dynamically create the Add Quote form
  function createAddQuoteForm() {
    // Get the container where the form will be inserted
    const formContainer = document.createElement('div');
    
    // Create the input field for the quote text
    const inputQuote = document.createElement('input');
    inputQuote.setAttribute('id', 'newQuoteText');
    inputQuote.setAttribute('type', 'text');
    inputQuote.setAttribute('placeholder', 'Enter a new quote');
    
    // Create the input field for the quote category
    const inputCategory = document.createElement('input');
    inputCategory.setAttribute('id', 'newQuoteCategory');
    inputCategory.setAttribute('type', 'text');
    inputCategory.setAttribute('placeholder', 'Enter quote category');
    
    // Create the button to add a new quote
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    
    // Attach the function to add a new quote when the button is clicked
    addButton.onclick = addQuote;
  
    // Append the input fields and the button to the form container
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
  
    // Append the form container to the body of the page (or another container element)
    document.body.appendChild(formContainer);
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      // Add the new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      // Clear input fields after adding the new quote
      document.getElementById("newQuoteText").value = '';
      document.getElementById("newQuoteCategory").value = '';
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Attach event listener to "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Call the function to dynamically create the Add Quote form when the page loads
  createAddQuoteForm();
  
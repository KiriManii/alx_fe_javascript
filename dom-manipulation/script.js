let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Opportunity" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
  ];
  
  // Mock server URL (we'll simulate syncing with JSONPlaceholder)
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
  
  // Function to fetch quotes from server (mock API)
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(SERVER_URL);
      const serverQuotes = await response.json();
  
      // Simulate converting server data to our quote structure
      const fetchedQuotes = serverQuotes.map(post => ({
        text: post.title,
        category: "Server"  // Assigning a default "Server" category to all fetched quotes
      }));
  
      handleConflictResolution(fetchedQuotes);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  }
  
  // Function to handle conflict resolution
  function handleConflictResolution(fetchedQuotes) {
    // Simple conflict resolution: server data takes precedence
    const serverHasNewQuotes = fetchedQuotes.length > quotes.length;
  
    if (serverHasNewQuotes) {
      alert("Server data has been updated. Syncing new quotes...");
      
      // Replace local quotes with server quotes if there's a conflict
      quotes = fetchedQuotes;
  
      // Update local storage
      saveQuotes();
      populateCategories();
      showRandomQuote();
    }
  }
  
  // Function to sync local quotes with the server (periodically)
  function syncWithServer() {
    fetchQuotesFromServer();
  }
  
  // Call the sync function every 30 seconds (adjust as needed)
  setInterval(syncWithServer, 30000);
  
  // Function to display a random or filtered quote
  function showRandomQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
      document.getElementById("quoteDisplay").innerHTML = '<p>No quotes available for this category.</p>';
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
  
    // Store the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }
  
  // Function to add a new quote
  async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
  
      // Save updated quotes array to local storage
      saveQuotes();
  
      // Send new quote to server
      await postQuoteToServer(newQuote);
  
      // Update categories in the dropdown if a new category was added
      populateCategories();
  
      // Clear input fields after adding the new quote
      document.getElementById("newQuoteText").value = '';
      document.getElementById("newQuoteCategory").value = '';
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Function to send a new quote to the server using POST
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST', // Specify the method as POST
        headers: {
          'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(quote) // Send the quote data as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to send quote to server.');
      }
  
      const result = await response.json();
      console.log('Quote successfully sent to server:', result);
    } catch (error) {
      console.error("Error posting quote to server:", error);
    }
  }
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to dynamically populate the category dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
  
    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    // Add new category options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Set last selected filter from local storage if available
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
    }
  }
  
  // Function to filter quotes by the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem('selectedCategory', selectedCategory); // Save the selected category
  
    if (selectedCategory === 'all') {
      showRandomQuote(quotes); // Show all quotes
    } else {
      const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
      showRandomQuote(filteredQuotes); // Show only quotes in the selected category
    }
  }
  
  // Function to dynamically create the Add Quote form
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    const inputQuote = document.createElement('input');
    inputQuote.setAttribute('id', 'newQuoteText');
    inputQuote.setAttribute('type', 'text');
    inputQuote.setAttribute('placeholder', 'Enter a new quote');
  
    const inputCategory = document.createElement('input');
    inputCategory.setAttribute('id', 'newQuoteCategory');
    inputCategory.setAttribute('type', 'text');
    inputCategory.setAttribute('placeholder', 'Enter quote category');
  
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
  
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
  
    document.body.appendChild(formContainer);
  }
  
  // Function to handle JSON import
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories(); // Update category dropdown after import
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
  
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
  
    URL.revokeObjectURL(url); // Clean up the URL object after the download
  }
  
  // Attach event listener to "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", () => {
    const selectedCategory = document.getElementById("categoryFilter").value;
    filterQuotes(); // Ensure filtering is respected when showing a new quote
  });
  
  // Attach event listener to "Export Quotes" button
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  
  // Load the last viewed quote from session storage and set up the page
  window.onload = function() {
    createAddQuoteForm();
    populateCategories(); // Populate the category dropdown
  
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
      const quote = JSON.parse(lastViewedQuote);
      document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
    } else {
      showRandomQuote();
    }
  };
  
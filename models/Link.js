import mongoose from 'mongoose';


// Define the Link schema
const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  datePublished: {
    type: Date,
    default: Date.now
  }
});

// Create the Link model
const Link = mongoose.model('Links', linkSchema);

// Example function to add a new link
/*const addLink = async () => {
  const newLink = new Link({
    title: 'Example Link',
    description: 'This is an example link',
    url: 'http://example.com',
    datePublished: new Date()
  });

  try {
    const savedLink = await newLink.save();
    console.log('Link saved:', savedLink);
  } catch (error) {
    console.error('Error saving link:', error);
  }
};

// Call the function to add a link
addLink();
*/
// Export the Link model as default
export default Link;

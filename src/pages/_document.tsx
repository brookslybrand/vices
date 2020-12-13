import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        {/* <body className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-orange-50"> */}
        <body className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 ">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

import './index.css'

function Home() {

  return (
    <div className="home_body">
      <h1 className="home-title">Multi-platform Job Tracker</h1>
      <p className="home-description">Welcome to my multi-platform Job Trackers! <br/>
        These are all implementations of the same app built using different tech stacks. <br/>
        You can add, edit, and delete jobs. <br/>
        You can also change statuses on jobs. <br/>
        The first app (and this website) are built using React and TypeScript and are deployed to Netlify.<br/>
        The backend is developed in Node.js and is hosted locally with access to a simple SQLite database.
        Future state is to deploy the backend to Vercel utilizing Neon Postgres.
      </p>

      <a href='/reacttracker' className="react_and_node_link">
        <div className="react_and_node">
          <div className="react_side">
            React & Typescript
          </div>
          <div className="node_side">
            Node.js & SQLite
          </div>
        </div>
      </a>

    </div>
  )
}

export default Home

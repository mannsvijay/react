import React from 'react'

function Github() {
    const [data, setData] = React.useState([]);
    useEffect(() => {
        fetch('https://api.github.com/users/mannsvijay')
        .then(res => res.json())
        .then(data => setData(data))
    }, [])

  return (
    <div className='text-center m-4 bg-gray-500 text-white p-4 rounded-lg'>
        <h1 className='text-2xl font-bold'>Github Profile</h1>
        <img src={data.avatar_url} alt="avatar" className='w-32 h-32 rounded-full mx-auto mt-4' />
        <h2 className='text-xl font-semibold mt-2'>{data.name}</h2>
        <p className='text-gray-300'>{data.bio}</p>
        <a href={data.html_url} className='text-blue-400 hover:underline mt-2 block'>{data.html_url}</a>
        
      
    </div>
  )
}

export default Github

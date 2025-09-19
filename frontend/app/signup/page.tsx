export default function Signup(){

  
    




    return(

        <div className="min-h-screen bg-white flex items-center justify-center">
            <form className="bg-gradient-to-br max-w-xl rounded-xl p-8 flex shadow-xl">
                {/* HEADING */}
                <div className="p-8 w-full space-y-5">
                <h1 className="text-center text-xl font-semibold mb-6" >SIGNUP</h1>
                </div>
                 
                 {/* USERNAME */}
                <div className="mb-4 relative">
                    <label htmlFor="Username" className="mb-1 text-gray-300 block">Username</label>
                    <input type ="text" name="Username" id="Username" className="border-gray-50 text-black px-4 py-2 mt-1"/>
                </div>

                {/* EMAIL */}
                <div className="mb-4 relative">
                    <label htmlFor="Email" className="mb-1 text-gray-300 block">Email</label>
                    <input type="text" name="Email" id="Email"
                    className="mt-1 border-gray-50 w-full px-4 py-2 text-black rounded-lg"/>
                </div>

                {/* Password */}
                <div className="mb-1">
                    <label htmlFor="Password"
                    className="mb-1 text-gray-300 block rounded-lg">Password</label>
                    <input type="Password" name="Password"
                    id="Password"
                    className="mt-1 px-4 py-2 w-full  border-gray-50 text-black rounded-lg"/>

                </div>
                
                <button type="submit"  className="w-full mb-3 py-2 bg-amber-950 text-white">Signup
                    
                </button>

            </form>

        </div>
    )
}
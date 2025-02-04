import { Layout } from "./Lay";


export const PasswordSuccess = () => {

  return (
    <Layout>
      <div className="w-3/4">
      <div>
      <h2 className="text-xl font-bold mb-4">Password reset Sucessfully</h2>

      </div>
        <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Login
          </button>
      </div>
    </Layout>
  );
}
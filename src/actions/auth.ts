// funcion de sing up

import { supabase } from "@/supabase/client";

interface IAuthLogin {
  email: string;
  password: string;
}

interface IAuthRegister {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string | null;
}

export const signUp = async ({ email, password, fullName, phoneNumber }: IAuthRegister) => {

  try {
    
    // 1 Crear o registrar usuario
    const { data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error("Error en el registro");
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error("Error al obtener el ID del usuario");
    }

    // 2. Autenticar el usuario recién creado (opcional, ya que supabase lo hace automáticamente)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error(signInError);
      throw new Error("Email o contraseña incorrectos");
    }

    // 3. Insertar el rol por defecto
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "customer",
    });

    if (roleError) {
      console.error(roleError);
      throw new Error("Error al asignar el rol de usuario");
    }

    // 4. Insertar los datos del usuario en la tabla customers
    const { error: customerError } = await supabase.from("customers").insert({
      user_id: userId,
      full_name: fullName,
      phone: phoneNumber,
      email,
    });

    if (customerError) {
      console.error(customerError);
      throw new Error("Error al insertar los datos del cliente");
    }

    return data;

  } catch (error) {
    console.error(error)
    throw new Error("Error en el registro")
  }

}

export const signIn = async ({ email, password }: IAuthLogin) => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error("Email o contraseña incorrectos");
  }

  return data;

}

export const signOut = async () => {

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error("Error al cerrar sesión");
  }

}

export const getSession = async () => {

  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error(error);
    throw new Error("Error al obtener la sesión");
  }
  return data;
}

// metodo para obtener el cliente logueado
export const getCustomerByUserId = async (userId: string) => {

  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, phone, email")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error al obtener los datos del cliente");
  }

  return data;
}

export const subscribeToAuthStateChange = (callback: (event: string, session: any) => void) => {

  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => {
    listener.subscription.unsubscribe();
  };

}
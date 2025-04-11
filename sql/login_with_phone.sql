-- Drop the existing function if it exists
drop function if exists public.login_with_phone(text, text);

-- Create the updated login_with_phone function
create or replace function public.login_with_phone(
    p_identity_number text,
    p_phone text
)
returns json
language plpgsql
security definer
as $$
declare
    v_user record;
    v_role text;
    v_token text;
begin
    -- Check if user exists with given phone and identity number
    select 
        id,
        name,
        last_name,
        identity_type,
        role_name,
        status,
        phone
    into v_user
    from public.members
    where identity_number = p_identity_number
    and phone = p_phone;

    if v_user is null then
        return json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    end if;

    -- Get the user's role
    v_role := v_user.role_name;

    -- Create a session token
    v_token := auth.sign(
        json_build_object(
            'role', v_role,
            'user_id', v_user.id,
            'exp', extract(epoch from now() + interval '1 week')::integer
        ),
        current_setting('app.jwt_secret', true)
    );

    return json_build_object(
        'success', true,
        'token', v_token,
        'user_id', v_user.id,
        'name', v_user.name,
        'last_name', v_user.last_name,
        'identity_type', v_user.identity_type,
        'role', v_user.role_name,
        'status', v_user.status,
        'phone', v_user.phone
    );
end;
$$;

-- Grant necessary permissions
grant execute on function public.login_with_phone(text, text) to anon, authenticated; 
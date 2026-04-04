'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/app/lib/auth-client';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreed: z.boolean().refine((val) => val === true, { message: 'You must agree to terms & conditions' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message ?? 'Registration failed. Please try again.');
      return;
    }

    router.push('auth/login');
  }

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <Image src="/assets/images/shape1.svg" alt="" width={300} height={300} className="_shape_img" />
        <Image src="/assets/images/dark_shape.svg" alt="" width={300} height={300} className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <Image src="/assets/images/shape2.svg" alt="" width={300} height={300} className="_shape_img" />
        <Image src="/assets/images/dark_shape1.svg" alt="" width={300} height={300} className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <Image src="/assets/images/shape3.svg" alt="" width={300} height={300} className="_shape_img" />
        <Image src="/assets/images/dark_shape2.svg" alt="" width={300} height={300} className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            {/* Left — illustration */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <Image src="/assets/images/registration.png" alt="Registration illustration" width={700} height={550} />
                </div>
                <div className="_social_registration_right_image_dark">
                  <Image src="/assets/images/registration1.png" alt="Registration illustration dark" width={700} height={550} />
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <Image src="/assets/images/logo.svg" alt="Logo" width={150} height={40} className="_right_logo" />
                </div>

                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                <button type="button" className="_social_registration_content_btn _mar_b40">
                  <Image src="/assets/images/google.svg" alt="Google" width={20} height={20} className="_google_img" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {serverError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {serverError}
                  </div>
                )}

                <form className="_social_registration_form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Name</label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          {...register('name')}
                        />
                        {errors.name && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{errors.name.message}</p>}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          className="form-control _social_registration_input"
                          {...register('email')}
                        />
                        {errors.email && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          {...register('password')}
                        />
                        {errors.password && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{errors.password.message}</p>}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{errors.confirmPassword.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          id="agreeTerms"
                          {...register('agreed')}
                        />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="agreeTerms">
                          I agree to terms &amp; conditions
                        </label>
                      </div>
                      {errors.agreed && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{errors.agreed.message}</p>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Registering...' : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{' '}
                        <Link href="/login">Login</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

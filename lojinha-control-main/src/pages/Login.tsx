import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Package, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/login', {
        email,
        password
      })

      const { token, user } = response.data

      // salva o token
      localStorage.setItem('token', token)

      // (opcional) salvar user
      localStorage.setItem('user', JSON.stringify(user))

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${user.name}`
      })

      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: 'Email ou senha incorretos.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background dark p-4'>
      {/* Background decorativo */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl' />
      </div>

      <Card className='w-full max-w-md glass border-border/50 animate-scale-in relative z-10'>
        <CardHeader className='text-center pb-2'>
          <div className='flex justify-center mb-4'>
            <div className='h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center'>
              <Package className='h-7 w-7 text-primary' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent className='pt-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-foreground'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='bg-secondary/50 border-border focus-visible:ring-primary'
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-foreground'>
                Senha
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='bg-secondary/50 border-border focus-visible:ring-primary pr-10'
                  disabled={isLoading}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <Eye className='h-4 w-4 text-muted-foreground' />
                  )}
                </Button>
              </div>
            </div>

            <div className='flex items-center justify-end'>
              <button
                type='button'
                className='text-sm text-primary hover:text-primary/80 transition-colors'
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type='submit'
              className='w-full gradient-primary hover:opacity-90 transition-opacity'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Sistema de Gestão de Estoque
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

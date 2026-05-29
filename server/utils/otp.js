export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function storeOTP(prisma, email, otp) {
  const key = String(email || '').trim().toLowerCase()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  // Replace any existing OTP for this email atomically
  await prisma.$transaction([
    prisma.otpToken.deleteMany({ where: { email: key } }),
    prisma.otpToken.create({ data: { email: key, otp, expiresAt } }),
  ])
}

export async function verifyOTP(prisma, email, otp) {
  const key = String(email || '').trim().toLowerCase()
  const record = await prisma.otpToken.findFirst({
    where: { email: key, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })
  if (!record) return false
  if (record.otp !== String(otp || '').trim()) return false
  await prisma.otpToken.delete({ where: { id: record.id } })
  return true
}

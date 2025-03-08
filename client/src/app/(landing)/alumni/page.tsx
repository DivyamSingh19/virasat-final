import AlumniCard from '@/components/landing/alumni-card'
import Container from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const alumni = () => {
  return (
    <section id="search-alumni" className="mb-20 mt-10">
        <Container>
          <h1 className="font-bold text-center text-5xl my-10">Find your Mentors</h1>
          <div>
            <div className="flex gap-6">
              <Input type="search" placeholder="Search Alumni" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Alumni Card */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 my-6">
              <AlumniCard 
                name="Satyam Bhosale"
                role="UI/UX Designer"
                company="Apple"
                exp="1"
                image="/alumni/boi1.jpg"
                prevComp="/alumni/alumni1company.png"
              />
              <AlumniCard 
                name="Mitesh Kamthe"
                role="Cybersecurity Expert"
                company="Google"
                exp="2"
                image="/alumni/boi2.jpg"
                prevComp="/alumni/alumni2company.png"
              />
              <AlumniCard 
                name="Aditya Sharma"
                role="Software Engineer"
                company="Microsoft"
                exp="3"
                image="/alumni/boi3.jpg"
                prevComp="/alumni/alumni3company.png"
              />
              <AlumniCard 
                name="Divyam Singh"
                role="Backend Developer"
                company="Amazon"
                exp="1"
                image="/alumni/boi4.jpg"
                prevComp="/alumni/alumni4company.png"
              />
            </div>
          </div>
        </Container>
      </section>
  )
}

export default alumni